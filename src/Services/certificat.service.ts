import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Certificat } from 'src/Models/Certificat';

@Injectable({
  providedIn: 'root'
})
export class CertificatService {
  private apiUrl = 'https://ihm-eta.vercel.app/api/api/certificats';

  constructor(private http: HttpClient) {}

 
// Récupérer tous les certificats
getAllCertificats(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl);
}

// Récupérer un certificat par ID
getCertificatById(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`);
}



}
