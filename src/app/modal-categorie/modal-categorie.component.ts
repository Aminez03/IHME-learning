import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Categorie } from 'src/Models/Categorie';

@Component({
  selector: 'app-modal-categorie',
  templateUrl: './modal-categorie.component.html',
  styleUrls: ['./modal-categorie.component.css']
})
export class ModalCategorieComponent {
  categorieForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ModalCategorieComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Categorie,
    private fb: FormBuilder
  ) {
    this.categorieForm = this.fb.group({
      nomCategorie: [data?.nomCategorie || '', Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.categorieForm.valid) {
      this.dialogRef.close(this.categorieForm.value);
    }
  }
}
