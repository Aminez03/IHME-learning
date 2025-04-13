import { Component } from '@angular/core';
import { QuestionDialogComponent } from '../question-dialog/question-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { ExamenService } from 'src/Services/examen.service';
import { MatDialog } from '@angular/material/dialog';
import { Examen } from 'src/Models/Examen';

@Component({
  selector: 'app-question-list',
  templateUrl: './question-list.component.html',
  styleUrls: ['./question-list.component.css']
})
export class QuestionListComponent {
  examenId!: number;
  examen?: Examen; // Add the missing property
  questions: any[] = [];
  message: string = ''; // Declare the message property
  error: string = ''; // Declare the error property

  constructor(
    private route: ActivatedRoute,
    private examenService: ExamenService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.examenId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadExamen(this.examenId);
    this.loadQuestions();
    
    console.log(this.examen);
  }

  loadQuestions(): void {
    this.examenService.getQuestionsByExamen(this.examenId).subscribe({
      next: (data) => this.questions = data,
      error: () => console.error("Erreur lors du chargement des questions.")
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '450px',
      data: { examenId: this.examenId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadQuestions();
    });
  }

  openEditDialog(question: any): void {
    const dialogRef = this.dialog.open(QuestionDialogComponent, {
      width: '450px',
      data: { 
        examenId: this.examenId,
        questionData: { ...question } // Ensure all properties including id are passed
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadQuestions();
    });
  }

  deleteQuestion(questionId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) {
      this.examenService.deleteQuestion(questionId).subscribe({
        next: () => {
          this.loadQuestions();
          alert('Question supprimée avec succès !'); // Simple alert for delete
        },
        error: () => {
          alert('Erreur lors de la suppression de la question'); // Simple alert for error
        }
      });
    }
  }

  loadExamen(id: number): void {
  this.examenService.getExamen(id).subscribe({
    next: (data) => {
      this.examen = data;
      this.message = '';
      this.error = '';
    },
    error: () => {     
      this.error = 'Erreur lors du chargement de l\'examen.';
    }
  });
}



}