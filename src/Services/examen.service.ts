import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Examen } from 'src/Models/Examen';
import { Question } from 'src/Models/Question';
import { Reponse } from 'src/Models/Reponse';

@Injectable({
  providedIn: 'root'
})
export class ExamenService {

  private apiUrl = 'https://ihm-eta.vercel.app/api/api';
  private apicertif="https://ihm-eta.vercel.app/api/api/userscertificats"
  constructor(private http: HttpClient) {}

  getExamenBySession(sessionId: number): Observable<Examen> {
    return this.http.get<Examen>(`${this.apiUrl}/formationSessions/${sessionId}/examen`);
  }

  getQuestionsByExamen(examenId: number): Observable<Question[]> {
    return this.http.get<Question[]>(`${this.apiUrl}/examens/${examenId}/questions`);
  }

  getReponsesByQuestion(questionId: number): Observable<Reponse[]> {
    return this.http.get<Reponse[]>(`${this.apiUrl}/questions/${questionId}/reponses`);
  }

 
// Méthode pour calculer le score avec authentification
calculerScore(examenId: number, token: string, reponses: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`, 
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });
  const body = {
    "reponses": reponses
  };
 // 'reponses':{
    //   "4":[13],
    //   "5":[17],
    //   "6":[21]
    // }


  return this.http.post(`${this.apiUrl}/examen/${examenId}/evaluer`, body, { headers });
}


 // Fonction pour récupérer les certificats de l'utilisateur
 getUserCertificats(token: string): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  return this.http.get(this.apicertif, { headers });
}
getExamens(): Observable<Examen[]> {
  return this.http.get<Examen[]>(`${this.apiUrl}/examens`);
}

getExamen(id: number): Observable<Examen> {
  return this.http.get<Examen>(`${this.apiUrl}/examens/${id}`);
}

ajouterExamen(data: any): Observable<Examen> {
  return this.http.post<Examen>(`${this.apiUrl}/examens`, data);
}

modifierExamen(id: number, data: any): Observable<Examen> {
  return this.http.put<Examen>(`${this.apiUrl}/examens/${id}`, data);
}

supprimerExamen(id: number): Observable<Examen> {
  return this.http.delete<Examen>(`${this.apiUrl}/examens/${id}`);
}
ajouterQuestion(data: any): Observable<Question> {
  return this.http.post<Question>(`${this.apiUrl}/questions`, data);
}
updateQuestion(data: any): Observable<Question> {
  if (!data.id) {
    return throwError(() => new Error('Question ID is required for update'));
  }
  return this.http.put<Question>(`${this.apiUrl}/questions/${data.id}`, data);
}

// New method to delete a question
deleteQuestion(questionId: number): Observable<Question> {
  return this.http.delete<Question>(`${this.apiUrl}/questions/${questionId}`);
}
ajouterReponse(data: any): Observable<Reponse> {
  return this.http.post<Reponse>(`${this.apiUrl}/reponses`, data);
}

updateReponse(data: any): Observable<Reponse> {
  if (!data.id) {
    return throwError(() => new Error('Reponse ID is required for update'));
  }
  return this.http.put<Reponse>(`${this.apiUrl}/reponses/${data.id}`, data);
}

deleteReponse(reponseId: number): Observable<Reponse> {
  return this.http.delete<Reponse>(`${this.apiUrl}/reponses/${reponseId}`);
}
}