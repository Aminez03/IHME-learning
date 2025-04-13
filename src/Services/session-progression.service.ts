import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { SessionProgression } from 'src/Models/SessionProgression';

@Injectable({
  providedIn: 'root'
})
export class SessionProgressionService {
  private apiUrl = 'https://ihm-eta.vercel.app/api/api/formationSessions';

  constructor(private http: HttpClient) {}

  getProgression(formationSessionID: number): Observable<SessionProgression> {
    const token = localStorage.getItem("CC_Token"); // Récupération du token
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<SessionProgression>(`${this.apiUrl}/${formationSessionID}/progression`, { headers });
  }
  
  updateProgression(formationSessionID: number, courId: number): Observable<{ message: string; progression: SessionProgression }> {
    const token = localStorage.getItem("CC_Token");
    if (!token) {
      console.error("Token non trouvé !");
      return throwError(() => new Error("Utilisateur non authentifié"));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<{ message: string; progression: SessionProgression }>(
      `${this.apiUrl}/${formationSessionID}/progression/update`,
      { "courID":courId },
      { headers } // Ajout du token
    );
  }
  
}