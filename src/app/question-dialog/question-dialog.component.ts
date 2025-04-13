import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExamenService } from 'src/Services/examen.service';

@Component({
  selector: 'app-question-dialog',
  templateUrl: './question-dialog.component.html',
  styleUrls: ['./question-dialog.component.css']
})
export class QuestionDialogComponent {
  questionForm: FormGroup;
  isEditMode: boolean = false;
  dialogTitle: string = 'Ajouter une Question';

  constructor(
    private fb: FormBuilder,
    private examenService: ExamenService,
    private dialogRef: MatDialogRef<QuestionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { examenId: number, questionData?: any }
  ) {
    this.isEditMode = !!data.questionData;
    this.dialogTitle = this.isEditMode ? 'Modifier la Question' : 'Ajouter une Question';

    // Initialize form with all fields, including id for edit mode
    this.questionForm = this.fb.group({
      id: [null], // Add id field to store question ID
      titre: ['', Validators.required],
      note: [1, [Validators.required, Validators.min(1)]],
      type: ['', Validators.required],
      image: ['']
    });

    // Populate form with question data if in edit mode
    if (this.isEditMode && this.data.questionData) {
      this.questionForm.patchValue({
        id: this.data.questionData.id,
        titre: this.data.questionData.titre,
        note: this.data.questionData.note,
        type: this.data.questionData.type,
        image: this.data.questionData.image || ''
      });
    }
  }

  save(): void {
    if (this.questionForm.valid) {
      const payload = { 
        ...this.questionForm.value,
        examenID: this.data.examenId
      };

      const serviceCall = this.isEditMode 
        ? this.examenService.updateQuestion(payload)
        : this.examenService.ajouterQuestion(payload);

      serviceCall.subscribe({
        next: () => {
          // Show success alert based on the action
          alert(this.isEditMode ? 'Question modifiée avec succès !' : 'Question ajoutée avec succès !');
          this.dialogRef.close(true);
        },
        error: () => {
          // Show error alert
          alert(`Erreur lors de ${this.isEditMode ? 'la modification' : "l'ajout"} de la question`);
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
