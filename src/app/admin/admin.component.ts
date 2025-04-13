import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AuthService } from '../authentification/auth.service';
import { MatPaginator } from '@angular/material/paginator';
import { UserDetailDialogComponent } from '../user-detail-dialog/user-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit, AfterViewInit {
  admins: any[] = [];
  paginatedAdmins: any[] = [];
  errorMessage: string = '';
  token: string = '';
  displayedColumns: string[] = ['nom', 'email', 'role', 'actions'];
  pageSize = 3;
  pageIndex = 0;
  pageSizeOptions: number[] = [3, 6, 9, 12];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private authService: AuthService,private dialog: MatDialog) {}

  ngOnInit(): void {
    this.token = localStorage.getItem('CC_Token') || '';
    this.fetchUsersByRole('admin');
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.updatePaginatedAdmins();
      });
    }
  }

  fetchUsersByRole(role: string): void {
    this.authService.getUsersByRole(role, this.token).subscribe(
      (response) => {
        if (response.success) {
          this.admins = response.users;
          this.updatePaginatedAdmins(); 
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

  updatePaginatedAdmins(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedAdmins = this.admins.slice(startIndex, endIndex);
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
  console.log('Suppression de l\'admin avec ID :', id);
  // Par exemple, appelle ton service ici :
  // this.adminService.deleteAdmin(id).subscribe(() => this.reloadAdmins());
}

openEdit(id: number): void {
  // TODO : remplacer ce console.log par ta logique de navigation ou d'ouverture de modale
  console.log('Édition de l\'admin avec ID :', id);
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
