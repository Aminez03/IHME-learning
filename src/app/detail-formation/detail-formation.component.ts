import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { Formation } from 'src/Models/Formation';
import { Session } from 'src/Models/Session';
import { FormationService } from 'src/Services/formation.service';
import { SessionService } from 'src/Services/session.service';
import { ModalSessionComponent } from '../modal-session/modal-session.component';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { AuthService } from '../authentification/auth.service';
import { CategorieService } from 'src/Services/categorie.service';
import { SousCategorieService } from 'src/Services/sous-categorie.service';
import { SousCategorie } from 'src/Models/SousCategorie';
import { Categorie } from 'src/Models/Categorie';

@Component({
  selector: 'app-detail-formation',
  templateUrl: './detail-formation.component.html',
  styleUrls: ['./detail-formation.component.css']
})
export class DetailFormationComponent {
  formation: Formation | undefined;
  sessions: Session[] = [];
  formateurs: { [key: number]: any } = {}; // Dictionnaire pour stocker les détails des formateurs
  displayedColumns: string[] = ['dateDebut', 'dateFin', 'statut', 'capacite', 'nombreInscrits','nombreCours', 'formateurID', 'actions'];
  Categorie: Categorie | undefined;
  sousCategorie: SousCategorie | undefined;

  userData: any = {};
  constructor(
    private FS: FormationService,
    private route: ActivatedRoute,
    private FSS: SessionService,
    private snackBar: MatSnackBar,
     private dialog: MatDialog,
        private userService: AuthService,
        private authService:AuthService,
        private CS: CategorieService,
        private SCS: SousCategorieService,
       

  ) {}

  ngOnInit(): void {
    this.fetchData();
    this.loadSessions();
    console.log('formateurs:', this.formateurs);
    console.log("user",this.userData)
  }

  fetchData(): void {
    const formationId = this.route.snapshot.params['id'];
    if (formationId) {
      this.FS.getFormationById(formationId).subscribe({
        next: (data) => {
          this.formation = data.formation;
          this.sessions = data.sessions;
          console.log('Formation récupérée avec succès :', this.formation);
          console.log('Sessions récupérées avec succès :', this.sessions);
          this.getSousCategorieById(this.formation?.sousCategorieID!);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des données :', err);
        },
      });
    }
  }
  inscrire(sessionId: number) {
    const token = localStorage.getItem('CC_Token');
    if (!token) {
      this.snackBar.open('Erreur: Token non trouvé. Veuillez vous connecter.', 'OK', { duration: 3000 });
      return;
    }

    this.FSS.inscrire(sessionId, token).subscribe({
      next: (response) => {
        this.snackBar.open('Inscription réussie !', 'OK', { duration: 3000 });
        console.log(response);
      },
      error: (error) => {
        console.error(error);
        this.snackBar.open('Erreur lors de l’inscription : ' + error.error.error, 'OK', { duration: 3000 });
      }
    });
  }
  open(): void {
    let dialogRef = this.dialog.open(ModalSessionComponent, {
      height: '500px',
      width: '400px',
    });
  
    dialogRef.afterClosed().subscribe(data => {
      if (data) {
        this.FSS.create(data).subscribe(() => {
          console.log("Session ajoutée avec succès");
          this.fetchData();  // Récupérer les sessions après l'ajout
        });
      }
    });
  }
  openEdit(id: number): void {
    this.FSS.getById(id).subscribe((session) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = session;
  
      let dialogRef = this.dialog.open(ModalSessionComponent, dialogConfig);
  
      dialogRef.afterClosed().subscribe(data => {
        if (data) {
          this.FSS.update(id, data).subscribe(() => {
            console.log("Session modifiée avec succès");
            this.fetchData();  // Récupérer les sessions après modification
          });
        }
      });
    });
  }
  deleteSession(id: number): void {
    let dialogRef = this.dialog.open(ConfirmdialogComponent, {
      height: '200px',
      width: '300px',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.FSS.delete(id).subscribe(() => {
          console.log("Session supprimée");
          this.fetchData();  // Récupérer les sessions après suppression
        });
      }
    });
  }
      

  loadSessions(): void {
    // Appel pour charger les sessions
    this.FSS.getAll().subscribe(sessions => {
      this.sessions = sessions;

      // Charger les détails des formateurs pour chaque session
      sessions.forEach(session => {
        this.getFormateurDetails(session.formateurID);
      });
    });
  }

  getFormateurDetails(formateurID: number): void {
    // Vérifie si les détails du formateur sont déjà chargés
    if (!this.formateurs[formateurID]) {
      this.userService.getUserByID(formateurID).subscribe(formateur => {
        this.formateurs[formateurID] = formateur;
      });
    }
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }
  iscandidat():boolean{
    return this.authService.iscandidat();
  }

  
  loadUserProfile() {
    this.userService.profil().subscribe({
      next: (data) => {
        this.userData = data; // Stocke les données dans userData
        console.log(this.userData);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du profil:', err);
      }
    });
  }
  isInscrit(): boolean {
    return this.userData?.formationSessionID != null; // Vérifie si formationSessionID existe
  }



  getCategorieById(categorieID: number): void {
    this.CS.getById(categorieID).subscribe((data) => {
      this.Categorie = data;
    });
  }

  getSousCategorieById(SouscategorieID: number): void {
    this.SCS.getById(SouscategorieID).subscribe((data) => {
      this.sousCategorie = data;
      this.getCategorieById(this.sousCategorie?.categorieID!);
    });

  }
  
}