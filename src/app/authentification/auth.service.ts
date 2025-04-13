// src/app/services/auth.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';

const API_URL = "https://ihm-eta.vercel.app/api/api/users";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private userRole: string = localStorage.getItem("role") || '';



  private roleSubject = new BehaviorSubject<string | null>(this.getRole());
  public role$ = this.roleSubject.asObservable();

  constructor(private http: HttpClient) {
    const user = localStorage.getItem("CC_Token");
    if (user) {
      this.currentUserSubject.next(user);
    }
  }
  getRole(): string | null {
    return localStorage.getItem('role');
  }

  setRole(role: string): void {
    localStorage.setItem('role', role);
    this.roleSubject.next(role);
  }

  clearRole(): void {
    localStorage.removeItem('role');
    this.roleSubject.next(null);
  }
  

  // Register a user
  signup(user: any): Observable<any> {
    return this.http.post(`${API_URL}/register`, user, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }




  // Login a user
  signin(user: any) {
    return this.http.post<any>(`${API_URL}/login`, user);

  }

  logout(): Observable<any> {
    const token = localStorage.getItem('CC_Token'); 
  
    // Pas de token => nettoyage local uniquement
    if (!token) {
      localStorage.clear();
      this.currentUserSubject.next(null);
      return of(true); // ✅ retourne quand même un Observable
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    return this.http.post(`${API_URL}/logout`, {}, { headers }).pipe(
      tap(() => {
        localStorage.clear();
        this.currentUserSubject.next(null);
      }),
      catchError((error) => {
        console.error('Erreur lors de l\'appel logout backend', error);
        localStorage.clear();
        this.currentUserSubject.next(null);
        return of(true); // ✅ même en cas d'erreur, on continue
      })
    );
  }
  
// Get user profile
  profil() {
    const token = localStorage.getItem("CC_Token");
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${API_URL}/user-profile`, { headers });
  }





  isAdmin(): boolean {
    return this.userRole === 'admin';
  }
  iscandidat(): boolean {
    return this.userRole === 'candidat';
  }
  isFormateur(): boolean {
    return this.userRole === 'formateur';
  }



  getUserByID(id: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/${id}`);
  }

  getUsersByRole(role: string, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` // Ajouter le token d'authentification
    });

    return this.http.get<any>(`${API_URL}/role/${role}`, { headers });
  }



  blockUser(id: number, token: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
    });

    return this.http.post(`${API_URL}/${id}/block`, {}, { headers });
  }
// Get user profile
profile() {
  const token = localStorage.getItem("CC_Token");
  console.log("Token récupéré :", token); // Vérifie si le token est correct
  if (!token) {
    console.error("Aucun token trouvé !");
    return;
  }
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.get(`${API_URL}/user-profile`, { headers });
}
updateUser(userData: any): Observable<any> {
  const token = localStorage.getItem("CC_Token");
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  return this.http.put(`${API_URL}/${userData.id}`, userData, { headers });
}
  
}
