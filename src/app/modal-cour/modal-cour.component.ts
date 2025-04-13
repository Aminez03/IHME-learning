import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Cour } from 'src/Models/Cour';

@Component({
  selector: 'app-modal-cour',
  templateUrl: './modal-cour.component.html',
  styleUrls: ['./modal-cour.component.css']
})
export class ModalCourComponent {
  form!: FormGroup;
  displayedColumns: string[] = ['id', 'titre', 'description', 'formationSessionID', 'action'];
  videoUrl: string = ''; // Stocke l'URL de la vidéo après upload
  constructor(
    public dialogRef: MatDialogRef<ModalCourComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: Cour // Injecter les données du cours
    
  ) {
    console.log(data);
    if(data){
    // Initialiser le formulaire avec les données du cours (si elles existent)
    this.form = new FormGroup({
      formationSessionID: new FormControl(data.formationSessionID || null, [Validators.required]),
      titre: new FormControl(data.titre || null, [Validators.required]),
      description: new FormControl(data.description || null, [Validators.required]),
      videoURL: new FormControl(data.videoURL || null, [Validators.required]),
    });
  }else{
    // Initialiser le formulaire avec des valeurs par défaut (si les données du cours n'existent pas)
    this.form = new FormGroup({   
      formationSessionID: new FormControl(null, [Validators.required]),
      titre: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      videoURL: new FormControl(null, [Validators.required]),
    });
  }
  }

  // Méthode pour enregistrer les données du formulaire
  save() {
    if (this.form.valid && this.videoUrl) {
      this.dialogRef.close(this.form.value);
    } else {
      console.log('Formulaire invalide ou vidéo non téléchargée.');
      console.log('Form Value:', this.form.value); // Affiche les valeurs du formulaire
      console.log('Form Errors:', this.form.errors); // Affiche les erreurs de validation du formulaire
      console.log('Video URL:', this.videoUrl); // Vérifie si l'URL de la vidéo est présente
    }
  }
  

  // Méthode pour fermer le modal sans enregistrer
  close() {
    this.dialogRef.close();
  }

  uploadVideo(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'rbzoyji0'); // Remplace par ton preset Cloudinary
    formData.append('cloud_name', 'dlj8nno5x');
    
    // Spécifie que le type de ressource est une vidéo
    this.http.post('https://api.cloudinary.com/v1_1/dlj8nno5x/video/upload', formData)
      .subscribe((response: any) => {
        this.videoUrl = response.url;  // Récupère l'URL de la vidéo téléchargée
        this.form.patchValue({ videoURL: response.url });  // Mise à jour du formulaire avec l'URL de la vidéo
        console.log('Vidéo uploadée avec succès:', response.url);
      });
  }
  


}