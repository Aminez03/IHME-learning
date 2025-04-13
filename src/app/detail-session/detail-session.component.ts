import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SessionService } from 'src/Services/session.service';
import { AuthService } from '../authentification/auth.service';
import { FormationService } from 'src/Services/formation.service';
import { CategorieService } from 'src/Services/categorie.service';
import { SousCategorieService } from 'src/Services/sous-categorie.service';
import { Formation } from 'src/Models/Formation';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-detail-session',
  templateUrl: './detail-session.component.html',
  styleUrls: ['./detail-session.component.css']
})
export class DetailSessionComponent {
  session: any;
  formateur: any | null = null;
  candidats: any[] = [];
  errorMessage: string = '';
  token: string = '';
  Categorie: any;
  sousCategorie: any;
  formation: Formation | undefined;

  constructor(
    private route: ActivatedRoute,
    private sessionService: SessionService,
    private userService: AuthService,
    private FS: FormationService,
    private CS: CategorieService,
    private SCS: SousCategorieService,
    private dialog: MatDialog,
  ) {}

  displayedColumns: string[] = ['nom', 'email', 'role', 'actions'];

  ngOnInit() {
    const token = localStorage.getItem('CC_Token');
    if (token) {
      this.token = token;
    }

    const sessionId = this.route.snapshot.paramMap.get('id');
    if (sessionId) {
      this.getSessionById(parseInt(sessionId, 10));

      // Charger les candidats
      this.sessionService.getAllCandidatsBySessionId(parseInt(sessionId, 10)).subscribe({
        next: (data) => {
          this.candidats = data;
          console.log('Candidats récupérés :', this.candidats);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des candidats :', err);
        }
      });
    }
  }

  getSessionById(id: number) {
    this.sessionService.getById(id).subscribe(
      (data) => {
        this.session = data;
        if (this.session && this.session.formateurID) {
          this.getFormateurDetails(this.session.formateurID);
          this.getFormationById(this.session.formationID);
        } else {
          console.error('Erreur lors de la récupération de la session :', 'Formateur ID non trouvé');
        }
      },
      (error) => {
        console.error('Erreur lors de la récupération de la session :', error);
      }
    );
  }

  getFormateurDetails(formateurID: number): void {
    this.userService.getUserByID(formateurID).subscribe((user) => {
      this.formateur = user.user;
    });
  }

  blockUser(id: number) {
    this.userService.blockUser(id, this.token).subscribe({
      next: (response) => {
        alert(response.message);
      },
      error: (err) => {
        alert('Erreur: ' + err.error.message);
      }
    });
  }

  isAdmin(): boolean {
    return this.userService.isAdmin();
  }
  isFormateur():boolean{
    return this.userService.isFormateur();
  }

  getFormationById(formationID: number): void {
    this.FS.getFormationById(formationID).subscribe({
      next: (data) => {
        console.log('Formation reçue :', data);
        this.formation = data.formation;
        this.getSousCategorieById(this.formation?.sousCategorieID!);
      },
      error: (err) => {
        console.error('Erreur lors de la récupération de la formation :', err);
        this.errorMessage = 'Impossible de charger la formation';
      }
    });
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


getUserById(id: number): void {
  this.userService.getUserByID(id).subscribe({
    next: (user) => {
      this.dialog.open(UserDetailDialogComponent, {
        width: '400px',
        data: user.user
      });

   
      console.log('Utilisateur récupéré :', user.user);
    },
    error: (err) => {
      console.error('Erreur lors de la récupération de l\'utilisateur :', err);
    }
  });
}
}
