import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { ExamenService } from 'src/Services/examen.service';
import { Examen } from 'src/Models/Examen';
import { Question } from 'src/Models/Question';
import { Reponse } from 'src/Models/Reponse';

@Component({
  selector: 'app-examen',
  templateUrl: './examen.component.html',
  styleUrls: ['./examen.component.css']
})
export class ExamenComponent implements OnInit, OnDestroy {
  examen: Examen | null = null;
  questions: Question[] = [];
  reponses: { [key: number]: Reponse[] } = {};
  selectedReponses: { [key: number]: number[] } = {};
  correctAnswers: { [key: number]: number[] } = {};
  showResults = false;
  hasStarted = false;
  errorMessage: string | null = null;
  scorefinal = 0;
  score = 0;
  totalNotes = 0;
  pourcentage = 0;
  certificatCree = false;
  message: string | null = null;
  certificatid: number | null = null;

  // ⏱️ Chronomètre
  timeLeft: number = 1* 60; // 20 minutes en secondes
  intervalId: any;

  constructor(
    private examenService: ExamenService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const sessionId = this.route.snapshot.params['id'];
    this.loadExamen(sessionId);
    this.fetchAndNavigateToCertif();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  startExam(): void {
    this.hasStarted = true;
    this.startTimer();
  }

  startTimer(): void {
    this.intervalId = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        clearInterval(this.intervalId);
        this.snackBar.open('Temps écoulé ! L\'examen est terminé automatiquement.', 'Fermer', { duration: 4000 });
        this.finishExam();
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' + s : s}`;
  }

  loadExamen(sessionId: number): void {
    this.examenService.getExamenBySession(sessionId).subscribe(examen => {
      this.examen = examen;
      this.loadQuestions(examen.id);
    });
  }

  loadQuestions(examenId: number): void {
    this.examenService.getQuestionsByExamen(examenId).subscribe(
      (questions: any) => {
        if (Array.isArray(questions)) {
          this.questions = questions;
          this.errorMessage = null;
          this.questions.forEach(question => {
            this.loadReponses(question.id);
            this.selectedReponses[question.id] = [];
          });
        } else {
          this.errorMessage = questions;
          this.questions = [];
        }
      },
      () => {
        this.errorMessage = 'Problème de récupération des questions';
        this.questions = [];
      }
    );
  }

  loadReponses(questionId: number): void {
    this.examenService.getReponsesByQuestion(questionId).subscribe(reponses => {
      this.reponses[questionId] = reponses;
      this.correctAnswers[questionId] = reponses
        .filter(r => r.statut)
        .map(r => r.id);
    });
  }

  onClickFinish(): void {
    if (!this.allQuestionsAnswered()) {
      this.snackBar.open('Veuillez répondre à toutes les questions avant de terminer l\'examen.', 'Fermer', {
        duration: 3000
      });
      return;
    }
    clearInterval(this.intervalId);
    this.finishExam();
  }

  finishExam(): void {
    this.calculateScore();
    this.showResults = true;

    if (this.examen) {
      const token = localStorage.getItem('CC_Token');
      if (!token) {
        this.snackBar.open('Erreur: Token non trouvé. Veuillez vous connecter.', 'OK', { duration: 3000 });
        return;
      }

      this.examenService.calculerScore(this.examen.id, token, this.selectedReponses).subscribe({
        next: (result: any) => {
          this.score = result.score;
          this.totalNotes = result.total_notes;
          this.pourcentage = result.pourcentage;
          this.certificatCree = result.certificat_cree;
          this.message = result.message;
        },
        error: (err) => {
          this.errorMessage = 'Erreur lors du calcul du score';
          console.error('Erreur API:', err);
        }
      });
    }
  }

  calculateScore(): void {
    this.scorefinal = 0;
    this.questions.forEach(question => {
      const correct = this.correctAnswers[question.id] || [];
      const selected = this.selectedReponses[question.id] || [];

      if (question.type === 'multiple') {
        const allCorrect = selected.every(id => correct.includes(id));
        const noIncorrect = selected.every(id => correct.includes(id));
        if (selected.length > 0 && allCorrect && noIncorrect) this.scorefinal++;
      } else if (question.type === 'seule réponse') {
        if (selected.length === 1 && correct.includes(selected[0])) this.scorefinal++;
      }
    });
  }

  toggleSelection(questionId: number, reponseId: number): void {
    const index = this.selectedReponses[questionId].indexOf(reponseId);
    if (index > -1) {
      this.selectedReponses[questionId].splice(index, 1);
    } else {
      this.selectedReponses[questionId].push(reponseId);
    }
  }

  selectUnique(questionId: number, reponseId: number): void {
    this.selectedReponses[questionId] = [reponseId];
  }

  allQuestionsAnswered(): boolean {
    return this.questions.every(q => this.selectedReponses[q.id] && this.selectedReponses[q.id].length > 0);
  }

  fetchAndNavigateToCertif(): void {
    const token = localStorage.getItem('CC_Token');
    if (!token) {
      this.snackBar.open('Erreur: Token non trouvé.', 'OK', { duration: 3000 });
      return;
    }
    this.examenService.getUserCertificats(token).subscribe({
      next: (certificats: any[]) => {
        if (certificats.length > 0) {
          this.certificatid = certificats[0].id;
        } else {
          this.snackBar.open('Aucun certificat trouvé.', 'OK', { duration: 3000 });
        }
      },
      error: (err) => {
        console.error('Erreur certificats:', err);
        this.snackBar.open('Erreur de récupération des certificats.', 'OK', { duration: 3000 });
      }
    });
  }
}
