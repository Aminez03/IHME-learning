import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reponse } from 'src/Models/Reponse';

@Injectable({
  providedIn: 'root'
})
export class ReponseService {
  private apiUrl = 'https://ihm-eta.vercel.app/api/api/reponses';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(this.apiUrl);
  }

  getById(id: number): Observable<Reponse> {
    return this.http.get<Reponse>(`${this.apiUrl}/${id}`);
  }

  create(reponse: Reponse): Observable<Reponse> {
    return this.http.post<Reponse>(this.apiUrl, reponse);
  }

  update(id: number, reponse: Reponse): Observable<Reponse> {
    return this.http.put<Reponse>(`${this.apiUrl}/${id}`, reponse);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
