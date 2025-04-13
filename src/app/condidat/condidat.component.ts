import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from '../authentification/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';

@Component({
  selector: 'app-condidat',
  templateUrl: './condidat.component.html',
  styleUrls: ['./condidat.component.css']
})
export class CondidatComponent implements OnInit, AfterViewInit {
  candidats: any[] = [];
  paginatedCandidats: any[] = [];
  errorMessage: string = '';
  token: string = '';
  displayedColumns: string[] = ['nom', 'email', 'role', 'actions'];
  pageSize = 3;
  pageIndex = 0;
  pageSizeOptions: number[] = [3, 6, 9, 12];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private authService: AuthService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.fetchUsersByRole('candidat');
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.updatePaginatedCandidats();
      });
    }
  }

  fetchUsersByRole(role: string): void {
    this.authService.getUsersByRole(role, this.token).subscribe(
      (response) => {
        if (response.success) {
          this.candidats = response.users;
          this.updatePaginatedCandidats(); // 👈 AJOUT ICI
        } else {
          this.errorMessage = response.message;
        }
      },
      (error) => {
        this.errorMessage = error.error?.message || 'Une erreur est survenue.';
        console.error('Erreur:', error);
      }
    );
  }
  
  updatePaginatedCandidats(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCandidats = this.candidats.slice(startIndex, endIndex);
  }

  blockUser(id: number): void {
    this.authService.blockUser(id, this.token).subscribe({
      next: (res) => alert(res.message),
      error: (err) => alert('Erreur : ' + err.error.message)
    });
  }
   // Ajoute ces méthodes dans ta classe AdminComponent
deleteUser(id: number): void {
  // TODO : remplacer ce console.log par ta logique de suppression réelle
  console.log('Suppression de condidatavec ID :', id);
  // Par exemple, appelle ton service ici :
  // this.adminService.deleteAdmin(id).subscribe(() => this.reloadAdmins());
}

openEdit(id: number): void {
  // TODO : remplacer ce console.log par ta logique de navigation ou d'ouverture de modale
  console.log('Édition de Condidat avec ID :', id);
  // Exemple : navigation vers une page d'édition
  // this.router.navigate(['/admin/edit', id]);
}


  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  getUserById(id: number): void {
    this.authService.getUserByID(id).subscribe({
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
