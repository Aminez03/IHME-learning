import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-profile-dialog-component',
  templateUrl: './edit-profile-dialog-component.component.html',
  styleUrls: ['./edit-profile-dialog-component.component.css']
})
export class EditProfileDialogComponentComponent {
  imageURL: string = ''; // Stocke l'URL de l'image après upload

  user: any;

  constructor(
    private http: HttpClient,
    public dialogRef: MatDialogRef<EditProfileDialogComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.user = { ...data }; // Clone user data to avoid modifying it directly
    console.log(this.imageURL);
  }

  save() {
    this.dialogRef.close(this.user); // Send updated data back
  }

  close() {
    this.dialogRef.close(); // Close without saving
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
        this.user.avatar = this.imageURL;
        console.log('Image uploadée avec succès:', response.url);
      });
  }




  
  // Méthode pour uploader l'image sur Cloudinary
  // uploadImage(event: any) {
  //   const file = event.target.files[0];
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   formData.append('upload_preset', 'rbzoyji0'); // Remplace par ton preset Cloudinary
  //   formData.append('cloud_name', 'dlj8nno5x');
  //   //https://res.cloudinary.com/dlj8nno5x/image/upload/      v1742758380/pic-1_azybku.jpg
  //   this.http.post('https://api.cloudinary.com/v1_1/dlj8nno5x/image/upload', formData)
  //     .subscribe((response: any) => {

  //       this.imageURL = response.url;
  //       this.form.patchValue({ image: response.url });
  //       console.log('Image uploadée avec succès:', response.url);
  //     });
  // }



}