import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { AuthService } from '../authentification/auth.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileDialogComponentComponent } from '../edit-profile-dialog-component/edit-profile-dialog-component.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.component.html',
  styleUrls: ['./profil.component.css']
})
export class ProfilComponent {
  user: any = null;
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private userService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.getUserProfile();
    console.log(this.user);

  }

  getUserProfile() {
    this.userService.profile()?.subscribe({
      next: (data: any) => {
        this.user = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        this.error = "Échec du chargement du profil.";
        this.loading = false;
      }
    });
  }

  openEditDialog() {
    const dialogRef = this.dialog.open(EditProfileDialogComponentComponent, {
      width: '400px',
      data: { ...this.user } // Clone user data to avoid direct mutation
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.user = result; // Update local user object immediately
        this.updateProfile(result);
      }
    });
  }

  updateProfile(updatedUser: any) {
    const token = localStorage.getItem("CC_Token"); 
    if (!token) {
      console.error("Aucun token trouvé !");
      return;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.userService.updateUser(updatedUser).subscribe({
      next: (response: any) => {
        console.log("Profil mis à jour :", response);
        this.user = response;
       // Recharger la page pour voir les changements
       location.reload();
        // ✅ Snackbar de succès
        this.snackBar.open('✅ Profil modifié avec succès !', 'Fermer', {
          duration: 6000,
          panelClass: ['snackbar-success']
        });

      
      },
      error: (error: HttpErrorResponse) => {
        console.error("Erreur mise à jour :", error);
        if (error.status === 403) {
          this.snackBar.open('❌ Vous n\'avez pas l\'autorisation de modifier cet utilisateur.', 'Fermer', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        } else {
          this.snackBar.open('❌ Une erreur est survenue lors de la mise à jour.', 'Fermer', {
            duration: 4000,
            panelClass: ['snackbar-error']
          });
        }
      }
    });
  }

  logout() {
    this.userService.logout()?.subscribe({
      next: () => {
        localStorage.removeItem("CC_Token");
        localStorage.removeItem("user");
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }
}
