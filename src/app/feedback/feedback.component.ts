import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Feedback } from 'src/Models/Feedback';
import { FeedbackService } from 'src/Services/feedback.service';
import { AuthService } from 'src/app/authentification/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: ['./feedback.component.css']
})
export class FeedbackComponent implements OnInit, OnDestroy {
  feedbacks: Feedback[] = [];
  newFeedbackText = '';
  formationSessionId = this.route.snapshot.params['id'];
  candidatData: any;
  showFeedbackList = true;
  private subscriptions: Subscription = new Subscription();

  constructor(
    private feedbackService: FeedbackService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadUserId();
    this.loadFeedbacks();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  loadFeedbacks(): void {
    const sub = this.feedbackService.getFeedbacksBySession(this.formationSessionId)
      .subscribe({
        next: (data) => {
          this.feedbacks = data;
          
          // Charger les avatars pour chaque utilisateur
          this.feedbacks.forEach(feedback => {
            this.loadUserAvatar(feedback);
          });
        },
        error: (error) => {
          this.snackBar.open('Erreur lors du chargement des feedbacks', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Erreur:', error);
        }
      });
    this.subscriptions.add(sub);
  }

  private loadUserAvatar(feedback: Feedback): void {
    const sub = this.authService.getUserByID(feedback.candidatID)
      .subscribe({
        next: (user) => {
          feedback.avatarUrl = user?.user?.avatar || 'assets/default-avatar.png';
          feedback.nom = user?.user?.nom || 'Utilisateur inconnu';
        },
        error: (error) => {
          feedback.avatarUrl = 'assets/default-avatar.png';
          feedback.nom = 'Utilisateur inconnu';
          console.error('Erreur lors du chargement de l\'avatar:', error);
        }
      });
    this.subscriptions.add(sub);
  }

  loadUserId(): void {
    const sub = this.authService.profil()
      .subscribe({
        next: (data) => {
          this.candidatData = data;
        },
        error: (error) => {
          this.snackBar.open('Erreur lors du chargement du profil', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Erreur lors de la récupération du profil:', error);
        }
      });
    this.subscriptions.add(sub);
  }

  addFeedback(): void {
    if (!this.newFeedbackText.trim() || !this.candidatData?.id) {
      return;
    }

    const newFeedback: Feedback = {
      texte: this.newFeedbackText.trim(),
      candidatID: this.candidatData.id,
      formationSessionID: this.formationSessionId
    };

    const sub = this.feedbackService.addFeedback(newFeedback)
      .subscribe({
        next: (feedback) => {
          this.feedbacks = [...this.feedbacks, feedback];
          this.newFeedbackText = '';
          this.snackBar.open('Commentaire ajouté avec succès', 'Fermer', {
            duration: 3000
          });
          // Charger l'avatar pour le nouveau feedback
          this.loadUserAvatar(feedback);
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de l\'ajout du commentaire', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Erreur:', error);
        }
      });
    this.subscriptions.add(sub);
  }

  deleteFeedback(id: number): void {
    const sub = this.feedbackService.deleteFeedback(id)
      .subscribe({
        next: () => {
          this.feedbacks = this.feedbacks.filter(f => f.id !== id);
          this.snackBar.open('Commentaire supprimé avec succès', 'Fermer', {
            duration: 3000
          });
        },
        error: (error) => {
          this.snackBar.open('Erreur lors de la suppression du commentaire', 'Fermer', {
            duration: 3000,
            panelClass: ['error-snackbar']
          });
          console.error('Erreur:', error);
        }
      });
    this.subscriptions.add(sub);
  }

  toggleFeedbackList(): void {
    this.showFeedbackList = !this.showFeedbackList;
  }
}