import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Formation } from 'src/Models/Formation';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private selectedSousCategorieId = new BehaviorSubject<number | null>(null);
  selectedSousCategorieId$ = this.selectedSousCategorieId.asObservable();

  private filteredFormations = new BehaviorSubject<Formation[]>([]); // Add BehaviorSubject for filtered formations
  filteredFormations$ = this.filteredFormations.asObservable(); // Observable for filtered formations

  constructor() {}

  setSousCategorie(id: number) {
    this.selectedSousCategorieId.next(id);
  }

  setFilteredFormations(formations: Formation[]) {
    this.filteredFormations.next(formations); // Method to update filtered formations
  }
}