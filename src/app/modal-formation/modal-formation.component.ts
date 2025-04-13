import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categorie } from 'src/Models/Categorie';
import { SousCategorie } from 'src/Models/SousCategorie';
import { CategorieService } from 'src/Services/categorie.service';
import { FormationService } from 'src/Services/formation.service';
import { SousCategorieService } from 'src/Services/sous-categorie.service';
@Component({
  selector: 'app-modal-formation',
  templateUrl: './modal-formation.component.html',
  styleUrls: ['./modal-formation.component.css']
})
export class ModalFormationComponent {
  form!: FormGroup;
  displayedColumns: string[] = ['nomFormation', 'niveau', 'duree',"dateModification","dateCreation","description","sousCategorieID"];

    sousCategories: SousCategorie[] = []; // Pour stocker les sous-catégories

    SousCategorie!: SousCategorie;
    imageURL: string = ''; // Stocke l'URL de l'image après upload

  constructor(
    public dialogRef: MatDialogRef<ModalFormationComponent>,
    private FS:FormationService,
    @Inject(MAT_DIALOG_DATA) data: any,
    private SS:SousCategorieService,
    private http: HttpClient,
    private snackBar: MatSnackBar 

  ) {
    console.log(data);

    if (data) {
  
        this.getSouSCategorie(data.formation.sousCategorieID); 
        this.form = new FormGroup({
        nomFormation: new FormControl(data.formation.nomFormation, [Validators.required]),
        niveau: new FormControl(data.formation.niveau, [Validators.required]),
        description: new FormControl(data.formation.description, [Validators.required]),
        image: new FormControl(data.formation.image, [Validators.required]),
        dateCreation: new FormControl(data.formation.dateCreation),
        dateModification: new FormControl(data.formation.dateModification),
        duree: new FormControl(data.formation.duree, [Validators.required]),
        sousCategorieID: new FormControl(data.formation.categorieID, [Validators.required])
      });
    } else {
      this.form = new FormGroup({
        nomFormation: new FormControl(null, [Validators.required]),
        niveau: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
        image: new FormControl(null, [Validators.required]),
        dateCreation: new FormControl<Date | null>(null),
        dateModification: new FormControl<Date | null>(null),
    
        duree: new FormControl(null, [Validators.required]),
        sousCategorieID: new FormControl(null, [Validators.required])

        
      });
    }
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
      this.snackBar.open('Formation enregistrée avec succès ! ✅', 'Fermer', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
    } else {
      this.snackBar.open('Merci de remplir tous les champs obligatoires ❌', 'Fermer', {
        duration: 3000,
        panelClass: ['error-snackbar']
      });
    }
  }
  close() {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    this.fetchData();
  
 
    
  }

  getSouSCategorie(id: number): void {
    this.SS.getById(id).subscribe((data) => {
      this.SousCategorie = data; 
    });
  }
  

  fetchData(): void {
    this.SS.getAll().subscribe((data) => {
        this.sousCategories=data;
      
    });
  }


  // Méthode pour uploader l'image sur Cloudinary
  uploadImage(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'rbzoyji0'); // Remplace par ton preset Cloudinary
    formData.append('cloud_name', 'dlj8nno5x');
    //https://res.cloudinary.com/dlj8nno5x/image/upload/      v1742758380/pic-1_azybku.jpg
    this.http.post('https://api.cloudinary.com/v1_1/dlj8nno5x/image/upload', formData)
      .subscribe((response: any) => {

        this.imageURL = response.url;
        this.form.patchValue({ image: response.url });
        console.log('Image uploadée avec succès:', response.url);
      });
  }

}
