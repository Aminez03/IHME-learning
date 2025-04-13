import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Formation } from 'src/Models/Formation';
import { Session } from 'src/Models/Session';

@Injectable({
  providedIn: 'root',
})
export class FormationService {
  private apiUrl = 'https://ihm-eta.vercel.app/api/api/formations'; // URL pour les formations
  private sessionsUrl = 'https://ihm-eta.vercel.app/api/api/sessions'; // URL pour les sessions

  constructor(private http: HttpClient) {}

  // Récupérer toutes les formations
  getAllFormations(): Observable<Formation[]> {
    return this.http.get<Formation[]>(this.apiUrl);
  }

  // Ajouter une nouvelle formation
  addFormation(formation: Formation): Observable<Formation> {
    return this.http.post<Formation>(this.apiUrl, formation);
  }

  // Mettre à jour une formation existante
  updateFormation(id: number, formation: Formation): Observable<Formation> {
    return this.http.put<Formation>(`${this.apiUrl}/${id}`, formation);
  }

  // Supprimer une formation
  deleteFormation(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Récupérer une formation par son ID avec ses sessions
  getFormationById(formationId: number): Observable<{ formation: Formation; sessions: Session[] }> {
    const formationUrl = `${this.apiUrl}/${formationId}`; // URL pour récupérer la formation
    const sessionsUrl = `${this.apiUrl}/${formationId}/formationSessions`; // URL pour récupérer les sessions

    return forkJoin({
      formation: this.http.get<Formation>(formationUrl),
      sessions: this.http.get<Session[]>(sessionsUrl),
    }).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des données :', error);
        throw error; // Propager l'erreur pour la gestion dans le composant
      })
    );
  }
}