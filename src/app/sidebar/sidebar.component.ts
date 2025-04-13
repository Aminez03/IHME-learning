import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Categorie } from 'src/Models/Categorie';
import { Formation } from 'src/Models/Formation';
import { SousCategorie } from 'src/Models/SousCategorie';
import { CategorieService } from 'src/Services/categorie.service';
import { AuthService } from '../authentification/auth.service';
import { SharedService } from 'src/Services/shared.service';
import { FormationService } from 'src/Services/formation.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  // Données
  Categories: Categorie[] = [];
  sousCategories: SousCategorie[] = [];
  formations: Formation[] = [];
  filteredFormations: Formation[] = [];

  // État UI
  selectedCategorie: number | null = null;
  searchTerm: string = '';
  isProfileMenuOpen = false;
  isDarkMode = false;
  isLoading = false;
  isRolesVisible = false;
  isCategorieMenuOpen: boolean = false;

  // Utilisateur
  userData: any = {};
  defaultAvatar = 'assets/image/pic-1.jpg';

  private lastSearchTerm: string = '';
  private destroy$ = new Subject<void>();
  role: string | null = null;
  private roleSub!: Subscription;

  constructor(
    private formationService: FormationService,
    private snackBar: MatSnackBar,
    private router: Router,
    private sharedService: SharedService,
    private categorieService: CategorieService,
    private authService: AuthService
    
  ) {}

  ngOnInit(): void {
    this.roleSub = this.authService.role$.subscribe((role) => {
      this.role = role;
    });
    this.loadUserProfile();
    this.fetchInitialData();
    this.setupSubscriptions();
    
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleProfileMenu(): void {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleRoles(): void {
    this.isRolesVisible = !this.isRolesVisible;
  }

  toggleCategorieMenu(): void {
    this.isCategorieMenuOpen = !this.isCategorieMenuOpen;
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-mode', this.isDarkMode);
    const message = this.isDarkMode ? 'Mode sombre activé' : 'Mode clair activé';
    this.showAlert(message, 'success');
  }

  logout(): void {
    this.authService.logout()?.subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  private fetchInitialData(): void {
    this.isLoading = true;
    this.fetchCategories();
    this.fetchFormations();
  }

  private setupSubscriptions(): void {
    this.sharedService.selectedSousCategorieId$
      .pipe(takeUntil(this.destroy$))
      .subscribe(sousCategorieId => {
        this.filterFormationsBySubCategory(sousCategorieId);
      });
  }

  private loadUserProfile(): void {
    this.authService.profil().subscribe({
      next: (data) => {
        this.userData = data;
      },
      error: (err) => {
        console.error('Profile error:', err);
        this.userData = { nom: 'Utilisateur', avatar: this.defaultAvatar };
        this.showAlert('Erreur chargement profil', 'error');
      }
    });
  }

  fetchCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (data) => {
        this.Categories = data;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Categories error:', err);
        this.Categories = [];
        this.isLoading = false;
        this.showAlert('Erreur chargement catégories', 'error');
      }
    });
  }

  fetchFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data;
        this.filteredFormations = [...data];
        this.sharedService.setFilteredFormations(data);
      },
      error: (err) => {
        console.error('Formations error:', err);
        this.formations = [];
        this.filteredFormations = [];
        this.sharedService.setFilteredFormations([]);
      }
    });
  }

  onCategorieChange(categorieID: number): void {
    this.categorieService.getSousCategories(categorieID).subscribe({
      next: (data) => {
        this.sousCategories = data;
      },
      error: (err) => {
        console.error('Subcategories error:', err);
        this.sousCategories = [];
      }
    });
  }
  

  onSousCategorieChange(sousCategorieID: number): void {
    this.sharedService.setSousCategorie(sousCategorieID);
    this.router.navigate(['/sous-categorie', sousCategorieID]);
  }

  filterFormations(): void {
    if (!this.searchTerm) {
      this.filteredFormations = [...this.formations];
    } else {
      const term = this.searchTerm.toLowerCase();
      this.filteredFormations = this.formations.filter(f =>
        f.nomFormation.toLowerCase().includes(term)
      );
    }
    this.sharedService.setFilteredFormations(this.filteredFormations);
    this.showSearchFeedback();
  }

  private filterFormationsBySubCategory(sousCategorieId: number | null): void {
    this.filteredFormations = sousCategorieId
      ? this.formations.filter(f => f.sousCategorieID === sousCategorieId)
      : [...this.formations];
   
    this.sharedService.setFilteredFormations(this.filteredFormations);
  }

  private showAlert(message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info'): void {
    const config = {
      duration: type === 'error' ? 5000 : 3000,
      horizontalPosition: 'right' as MatSnackBarHorizontalPosition,
      verticalPosition: 'top' as MatSnackBarVerticalPosition,
      panelClass: [`snackbar-${type}`]
    };

    this.snackBar.open(message, '×', config);
  }

  private showSearchFeedback(): void {
    if (this.filteredFormations.length === 0 && this.searchTerm) {
      this.showAlert(`Aucun résultat pour "${this.searchTerm}"`, 'warning');
    } else if (this.filteredFormations.length > 0) {
      this.showAlert(`${this.filteredFormations.length} résultats`, 'success');
    }
  }
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  isFormateur(): boolean {
    return this.authService.isFormateur();
  }
  iscandidat(): boolean {
    return this.authService.iscandidat();
  }
}
