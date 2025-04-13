import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Session } from 'src/Models/Session';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  getCertificatBySessionId(sessionId: string) {
    throw new Error('Method not implemented.');
  }
  private apiUrl = 'https://ihm-eta.vercel.app/api/api/formationSessions';

  constructor(private http: HttpClient) {}

  inscrire(sessionId: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
    return this.http.post(`${this.apiUrl}/${sessionId}/register`, {}, { headers });
  }
  getAllCandidatsBySessionId(formationSessionID: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${formationSessionID}/candidats`);
  }
  
  
  getAll(): Observable<Session[]> {
    return this.http.get<Session[]>(this.apiUrl);
  }

  getById(id: number): Observable<Session> {
    return this.http.get<Session>(`${this.apiUrl}/${id}`);
  }

  create(session: Session): Observable<Session> {
    return this.http.post<Session>(this.apiUrl, session);
  }

  update(id: number, session: Session): Observable<Session> {
    return this.http.put<Session>(`${this.apiUrl}/${id}`, session);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}