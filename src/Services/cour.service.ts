import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cour } from 'src/Models/Cour';

@Injectable({
  providedIn: 'root'
})
export class CourService {
  private apiUrl = 'https://ihm-eta.vercel.app/api/api/cours'; 
  private apiUrlSession = 'https://ihm-eta.vercel.app/api/api/formationSessions';
  constructor(private http: HttpClient) {}

  // Récupérer tous les cours
  getAllCours(): Observable<Cour[]> {
    return this.http.get<Cour[]>(this.apiUrl);
  }

// Méthode pour récupérer les cours par sessionid
getAllCoursBySessionId(formationSessionID: number): Observable<Cour[]> {
  return this.http.get<Cour[]>(`${this.apiUrlSession}/${formationSessionID}/cours`);
}


  // Récupérer les cours d'une formation spécifique
  getCoursById(id: number): Observable<Cour> {
    return this.http.get<Cour>(`${this.apiUrl}/${id}`);
  }

  // Ajouter un nouveau cours
  addCours(cour: Cour): Observable<Cour> {
    return this.http.post<Cour>(this.apiUrl, cour);
  }

  // Mettre à jour un cours existant
  updateCours(id: number, cours: Cour): Observable<Cour> {
    return this.http.put<Cour>(`${this.apiUrl}/${id}`, cours);
  }

  // Supprimer un cours
  deleteCours(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }



}