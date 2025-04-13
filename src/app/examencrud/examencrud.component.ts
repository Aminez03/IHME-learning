import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Examen } from 'src/Models/Examen';
import { ExamenService } from 'src/Services/examen.service';
import { ExamencrudDialogComponent } from '../examencrud-dialog/examencrud-dialog.component';

@Component({
  selector: 'app-examencrud',
  templateUrl: './examencrud.component.html',
  styleUrls: ['./examencrud.component.css']
})
export class ExamencrudComponent {
  examens: Examen[] = [];
  examenForm: FormGroup;
  displayedColumns: string[] = ['titre', 'nombreQuestion', 'duree', 'formationSessionID', 'actions'];
  message: string = '';
  error: string = '';

  constructor(
    private router: Router,
    private examenService: ExamenService,
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.examenForm = this.fb.group({
      titre: ['', Validators.required],
      nombreQuestion: [0, [Validators.required, Validators.min(1)]],
      duree: [0, [Validators.required, Validators.min(1)]],
      formationSessionID: [0, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getExamens();
  }

  // 🔹 Ouvre la liste des questions pour un examen
  openQuestionList(examenId: number): void {
    this.router.navigate(['/examencrud', examenId, 'questions']);
  }

  // 🔹 Récupère tous les examens
  getExamens(): void {
    this.examenService.getExamens().subscribe({
      next: (data) => {
        this.examens = data;
        this.message = '';
        this.error = '';
      },
      error: () => {
        this.error = 'Erreur lors du chargement des examens.';
      }
    });
  }

  // 🔹 Supprime un examen
  deleteExamen(id: number): void {
    if (confirm('Voulez-vous vraiment supprimer cet examen ?')) {
      this.examenService.supprimerExamen(id).subscribe({
        next: () => {
          this.message = 'Examen supprimé.';
          this.getExamens();
          alert('Examen supprimé avec succès !'); // Simple alert for delete
        },
        error: () => {
          this.error = 'Erreur lors de la suppression.';
          alert('Erreur lors de la suppression de l\'examen.'); // Simple alert for error
        }
      });
    }
  }

  // 🔹 Ouvre la boîte de dialogue pour ajouter ou modifier un examen
  openDialog(examen?: any): void {
    const dialogRef = this.dialog.open(ExamencrudDialogComponent, {
      width: '400px',
      data: examen ? { ...examen } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const { data, action } = result;
        if (action === 'add') {
          this.examenService.ajouterExamen(data).subscribe({
            next: () => {
              this.getExamens();
              alert('Examen ajouté avec succès !'); // Simple alert for add
            },
            error: () => {
              alert('Erreur lors de l\'ajout de l\'examen.'); // Simple alert for error
            }
          });
        } else if (action === 'update') {
          this.examenService.modifierExamen(data.id, data).subscribe({
            next: () => {
              this.getExamens();
              alert('Examen modifié avec succès !'); // Simple alert for modify
            },
            error: () => {
              alert('Erreur lors de la modification de l\'examen.'); // Simple alert for error
            }
          });
        }
      }
    });
  }
  editExamen(examen: Examen): void {
    this.openDialog(examen);
  }
}
