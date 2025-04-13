import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Cour } from 'src/Models/Cour';
import { Session } from 'src/Models/Session';
import { SessionProgression } from 'src/Models/SessionProgression';
import { CourService } from 'src/Services/cour.service';
import { SessionProgressionService } from 'src/Services/session-progression.service';
import { SessionService } from 'src/Services/session.service';
import { AuthService } from '../authentification/auth.service';
import { FormationService } from 'src/Services/formation.service';
import { CategorieService } from 'src/Services/categorie.service';
import { SousCategorieService } from 'src/Services/sous-categorie.service';
import { Formation } from 'src/Models/Formation';

@Component({
  selector: 'app-detail-cour',
  templateUrl: './detail-cour.component.html',
  styleUrls: ['./detail-cour.component.css']
})
export class DetailCourComponent implements OnInit {
  cour?: Cour;
  session?: Session;
  progression?: SessionProgression;
  formation?: Formation;
  sousCategorie: any;
  Categorie: any;

  progressionValue = 0;
  isLoading = true;
  errorMessage: string | null = null;
  mode: 'determinate' | 'indeterminate' = 'indeterminate';

  constructor(
    private route: ActivatedRoute,
    private courService: CourService,
    private sessionProgressionService: SessionProgressionService,
    private sessionService: SessionService,
    private authService: AuthService,
    private FS: FormationService,
    private CS: CategorieService,
    private SCS: SousCategorieService
  ) {}

  ngOnInit(): void {
    this.loadCourById();
  }

  // ✅ Charger les détails du cours à partir de l'ID dans l'URL
  private loadCourById(): void {
    const courId = +this.route.snapshot.params['id'];
    if (!courId) {
      this.setErrorMessage('ID du cours non valide.');
      return;
    }

    this.courService.getCoursById(courId).subscribe({
      next: (courData) => {
        this.cour = courData;
        if (this.cour?.formationSessionID) {
          this.loadSessionAndProgression(this.cour.formationSessionID);
        } else {
          this.setErrorMessage('Session ID manquant pour ce cours.');
        }
      },
      error: (err) => this.setErrorMessage('Erreur lors du chargement du cours.', err)
    });
  }

  // ✅ Récupération de la session + progression en parallèle
  private loadSessionAndProgression(sessionId: number): void {
    forkJoin({
      session: this.sessionService.getById(sessionId),
      progression: this.sessionProgressionService.getProgression(sessionId)
    }).subscribe({
      next: ({ session, progression }) => {
        this.session = session;
        this.progression = progression;
        this.calculateProgressionPercentage();
        this.loadFormationDetails(session.formationID);
        this.mode = 'determinate';
        this.isLoading = false;
      },
      error: (err) => this.setErrorMessage('Erreur lors du chargement de la session et de la progression.', err)
    });
  }

  // ✅ Calculer le pourcentage de progression
  private calculateProgressionPercentage(): void {
    const totalCourses = this.session?.nombreCours || 1;
    const progress = this.progression?.progression || 0;
    this.progressionValue = Math.round((progress / totalCourses) * 100);
  }

  // ✅ Mettre à jour la progression
  updateProgression(): void {
    if (!this.cour?.formationSessionID || !this.cour.id) return;

    this.sessionProgressionService.updateProgression(this.cour.formationSessionID, this.cour.id).subscribe({
      next: (data) => {
        if (data?.progression !== undefined) {
          this.progression = data.progression;
          this.calculateProgressionPercentage();
          console.log('Progression mise à jour:', this.progression);
        } else {
          console.error('Réponse inattendue lors de la mise à jour de la progression', data);
        }
      },
      error: (err) => this.setErrorMessage('Erreur lors de la mise à jour de la progression.', err)
    });
  }


  
  // ✅ Clic sur la vidéo
 onVideoClick(event: Event): void {
  const videoElement = event.target as HTMLVideoElement;

  if (videoElement.paused) {

    this.updateProgression();

    // Wait briefly then reload
    setTimeout(() => {
      location.reload();
    }, 500);
  }
}

  

  // ✅ Charger la formation, sous-catégorie et catégorie
  private loadFormationDetails(formationID: number): void {
    this.FS.getFormationById(formationID).subscribe({
      next: (data) => {
        this.formation = data.formation;
        if (this.formation?.sousCategorieID) {
          this.getSousCategorieById(this.formation.sousCategorieID);
        }
      },
      error: (err) => this.setErrorMessage('Erreur lors de la récupération de la formation.', err)
    });
  }

  private getSousCategorieById(sousCategorieID: number): void {
    this.SCS.getById(sousCategorieID).subscribe({
      next: (data) => {
        this.sousCategorie = data;
        this.getCategorieById(data?.categorieID);
      },
      error: (err) => this.setErrorMessage('Erreur lors de la récupération de la sous-catégorie.', err)
    });
  }

  private getCategorieById(categorieID: number): void {
    this.CS.getById(categorieID).subscribe({
      next: (data) => {
        this.Categorie = data;
      },
      error: (err) => this.setErrorMessage('Erreur lors de la récupération de la catégorie.', err)
    });
  }

  // ✅ Gestion centralisée des erreurs
  private setErrorMessage(message: string, error?: any): void {
    this.errorMessage = message;
    this.isLoading = false;
    console.error(message, error || '');
  }

  // ✅ Vérification du rôle candidat
  iscandidat(): boolean {
    return this.authService.iscandidat();
  }
}
