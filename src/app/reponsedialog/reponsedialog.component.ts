import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ExamenService } from 'src/Services/examen.service';

@Component({
  selector: 'app-reponsedialog',
  templateUrl: './reponsedialog.component.html',
  styleUrls: ['./reponsedialog.component.css']
})
export class ReponsedialogComponent {
  reponseForm: FormGroup;
  isEditMode: boolean = false;
  dialogTitle: string = 'Ajouter une Réponse';

  constructor(
    private fb: FormBuilder,
    private examenService: ExamenService,
    private dialogRef: MatDialogRef<ReponsedialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { questionId: number, reponseData?: any }
  ) {
    this.isEditMode = !!data.reponseData;
    this.dialogTitle = this.isEditMode ? 'Modifier la Réponse' : 'Ajouter une Réponse';

    this.reponseForm = this.fb.group({
      id: [null],
      texte: ['', Validators.required],
      statut: [null, Validators.required] // Changed from false to null to require selection
    });

    if (this.isEditMode && this.data.reponseData) {
      this.reponseForm.patchValue({
        id: this.data.reponseData.id,
        texte: this.data.reponseData.texte,
        statut: this.data.reponseData.statut
      });
    }
  }

  save(): void {
    if (this.reponseForm.valid) {
      const payload = {
        ...this.reponseForm.value,
        questionID: this.data.questionId
      };

      const serviceCall = this.isEditMode
        ? this.examenService.updateReponse(payload)
        : this.examenService.ajouterReponse(payload);

      serviceCall.subscribe({
        next: () => {
          // Show success alert based on the action
          alert(this.isEditMode ? 'Réponse modifiée avec succès !' : 'Réponse ajoutée avec succès !');
          this.dialogRef.close(true);
        },
        error: () => {
          // Show error alert
          alert(`Erreur lors de ${this.isEditMode ? 'la modification' : "l'ajout"} de la réponse`);
        }
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
