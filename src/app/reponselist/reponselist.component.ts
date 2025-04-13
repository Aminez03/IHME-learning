import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Reponse } from 'src/Models/Reponse';
import { ExamenService } from 'src/Services/examen.service';
import { ReponsedialogComponent } from '../reponsedialog/reponsedialog.component';
import { QuestionService } from 'src/Services/question.service';
import { Question } from 'src/Models/Question';

@Component({
  selector: 'app-reponselist',
  templateUrl: './reponselist.component.html',
  styleUrls: ['./reponselist.component.css']
})
export class ReponselistComponent {
  questionId!: number;
  question!:any;
  reponses: Reponse[] = [];
  examen: any; // Define the 'examen' property, replace 'any' with the correct type if known
  message: string = '';
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private qestionService: QuestionService,
    private examenService: ExamenService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.questionId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadQuestion(this.questionId);
    this.loadReponses();
   
    console.log(this.questionId);
  }

  loadReponses(): void {
    this.examenService.getReponsesByQuestion(this.questionId).subscribe({
      next: (data) => this.reponses = data,
      error: () => console.error("Erreur lors du chargement des réponses.")
    });
  }

  openAddDialog(): void {
    const dialogRef = this.dialog.open(ReponsedialogComponent, {
      width: '450px',
      data: { questionId: this.questionId }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadReponses();
    });
  }

  openEditDialog(reponse: Reponse): void {
    const dialogRef = this.dialog.open(ReponsedialogComponent, {
      width: '450px',
      data: { 
        questionId: this.questionId,
        reponseData: { ...reponse }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) this.loadReponses();
    });
  }

  deleteReponse(reponseId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette réponse ?')) {
      this.examenService.deleteReponse(reponseId).subscribe({
        next: () => {
          this.loadReponses();
          alert('Réponse supprimée avec succès !'); // Simple alert for delete
        },
        error: () => {
          alert('Erreur lors de la suppression de la réponse'); // Simple alert for error
        }
      });
    }
  }


  loadQuestion(id: number): void {
    this.qestionService.getById(id).subscribe({
      next: (data) => {
        this.question = data;
        this.loadExamen(this.question?.examenID);
        this.message = '';
        this.error = '';
      },
      error: () => {     
        this.error = 'Erreur lors du chargement de la question.';
      }
    });
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
