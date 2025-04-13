import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormationService } from 'src/Services/formation.service';
import { Formation } from 'src/Models/Formation';

@Component({
  selector: 'app-formation-par-sous-categorie',
  templateUrl: './formation-par-sous-categorie.component.html',
  styleUrls: ['./formation-par-sous-categorie.component.css']
})
export class FormationParSousCategorieComponent implements OnInit {
  sousCategorieId!: number;
  formations: Formation[] = [];
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private formationService: FormationService
  ) {}

  ngOnInit(): void {
    this.sousCategorieId = +this.route.snapshot.paramMap.get('id')!;
    this.getFormationsParSousCategorie();
  }

  getFormationsParSousCategorie(): void {
    this.formationService.getAllFormations().subscribe({
      next: (data) => {
        this.formations = data.filter(f => f.sousCategorieID === this.sousCategorieId);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur chargement formations :', err);
        this.formations = [];
        this.isLoading = false;
      }
    });
  }
}
