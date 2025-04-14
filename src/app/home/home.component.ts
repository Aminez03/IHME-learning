import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Categorie } from 'src/Models/Categorie';
import { Formation } from 'src/Models/Formation';
import { SousCategorie } from 'src/Models/SousCategorie';
import { CategorieService } from 'src/Services/categorie.service';
import { FormationService } from 'src/Services/formation.service';
import { SousCategorieService } from 'src/Services/sous-categorie.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  formations: Formation[] = [];
  filteredFormations: Formation[] = [];
  paginatedFormations: Formation[] = [];

  categories: Categorie[] = [];
  subcategories: SousCategorie[] = [];
  selectedCategory: Categorie | null = null;
  selectedSubCategory: SousCategorie | null = null;

  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  

  carouselImages = [
    { image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028', caption: 'Apprenez ce que vous voulez' },
    { image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97', caption: 'Maîtrisez de nouvelles compétences' },
    { image: 'https://images.unsplash.com/photo-1501504905252-473c47e087f8', caption: 'Faites évoluer votre carrière' }
  ];

  currentSlide = 0;

  constructor(
    private formationService: FormationService,
    private categorieService: CategorieService,
    private sousCategorieService: SousCategorieService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadFormations();
    this.loadCategories();
    this.startCarousel();
  }

  loadFormations(): void {
    this.formationService.getAllFormations().subscribe({
      next: (formations: Formation[]) => {
        this.formations = formations;
        this.filteredFormations = formations;
        this.updatePagination();
      },
      error: (err) => console.error('Error loading formations:', err)
    });
  }

  loadCategories(): void {
    this.categorieService.getAll().subscribe({
      next: (categories: Categorie[]) => this.categories = categories,
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  onCategorySelect(category: Categorie): void {
    this.selectedCategory = category;
    this.selectedSubCategory = null;
    this.filteredFormations = this.formations;
    this.loadSubcategories(category.id);
    this.currentPage = 1;
    this.updatePagination();
  }

  loadSubcategories(categoryId: number): void {
    this.categorieService.getSousCategories(categoryId).subscribe({
      next: (subcategories: SousCategorie[]) => this.subcategories = subcategories,
      error: (err) => console.error('Error loading subcategories:', err)
    });
  }

  onSubCategorySelect(subcategory: SousCategorie): void {
    this.selectedSubCategory = subcategory;
    this.filterFormations(subcategory.id);
  }

  filterFormations(subCategoryId: number): void {
    this.sousCategorieService.getFormations(subCategoryId).subscribe({
      next: (formations: Formation[]) => {
        this.filteredFormations = formations;
        this.currentPage = 1;
        this.updatePagination();
      },
      error: (err) => {
        console.error('Error filtering formations:', err);
        this.filteredFormations = this.formations;
        this.updatePagination();
      }
    });
  }

  resetSelection(): void {
    this.selectedCategory = null;
    this.selectedSubCategory = null;
    this.subcategories = [];
    this.filteredFormations = this.formations;
    this.currentPage = 1;
    this.updatePagination();
  }

  scrollToSection(section: string): void {
    if (section === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  startCarousel(): void {
    setInterval(() => this.nextSlide(), 5000);
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.carouselImages.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.carouselImages.length) % this.carouselImages.length;
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredFormations.length / this.itemsPerPage);
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedFormations = this.filteredFormations.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePagination();
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePagination();
    }
  }
}
