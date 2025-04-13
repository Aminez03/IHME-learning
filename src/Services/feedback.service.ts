import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Feedback } from 'src/Models/Feedback';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'https://ihm-eta.vercel.app/api/api/feedbacks'; // Modifier selon ton API
  private apiSession = 'https://ihm-eta.vercel.app/api/api/formationSessions';
  constructor(private http: HttpClient) {}

  getFeedbacksBySession(formationSessionIDId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiSession}/${formationSessionIDId}/feedbacks`);
  }

  addFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.post<Feedback>(this.apiUrl, feedback);
  }

  updateFeedback(feedback: Feedback): Observable<Feedback> {
    return this.http.put<Feedback>(`${this.apiUrl}/${feedback.id}`, feedback);
  }

  deleteFeedback(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
