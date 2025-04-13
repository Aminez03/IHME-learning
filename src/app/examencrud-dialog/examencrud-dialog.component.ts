import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-examencrud-dialog',
  templateUrl: './examencrud-dialog.component.html',
  styleUrls: ['./examencrud-dialog.component.css']
})
export class ExamencrudDialogComponent {
  examenForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ExamencrudDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.examenForm = this.fb.group({
      id: [data?.id],
      titre: [data?.titre || '', Validators.required],
      nombreQuestion: [data?.nombreQuestion || 0, [Validators.required, Validators.min(1)]],
      duree: [data?.duree || 0, [Validators.required, Validators.min(1)]],
      formationSessionID: [data?.formationSessionID || 0, Validators.required]
    });
  }

  onSubmit(): void {
    if (this.examenForm.valid) {
      this.dialogRef.close({
        data: this.examenForm.value,
        action: this.data ? 'update' : 'add' // Indicate whether this is an add or update action
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
