import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SousCategorie } from 'src/Models/SousCategorie';

@Injectable({
  providedIn: 'root'
})
export class SousCategorieService {
  private apiUrl = 'https://ihm-eta.vercel.app/api/api/sousCategories';

  constructor(private http: HttpClient) {}

  getAll(): Observable<SousCategorie[]> {
    return this.http.get<SousCategorie[]>(this.apiUrl);
  }

  getById(id: number): Observable<SousCategorie> {
    return this.http.get<SousCategorie>(`${this.apiUrl}/${id}`);
  }

  create(sousCategorie: SousCategorie): Observable<SousCategorie> {
    return this.http.post<SousCategorie>(this.apiUrl, sousCategorie);
  }

  update(id: number, sousCategorie: SousCategorie): Observable<SousCategorie> {
    return this.http.put<SousCategorie>(`${this.apiUrl}/${id}`, sousCategorie);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  // Méthode pour récupérer les formations par sousCatégorie
  getFormations(sousCategorieID: number ): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${sousCategorieID}/formations`);
  }
}