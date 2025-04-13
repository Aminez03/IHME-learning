import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Formation } from 'src/Models/Formation';

@Component({
  selector: 'app-upload-image',
  templateUrl: './upload-image.component.html',
  styleUrls: ['./upload-image.component.css']
})
export class UploadImageComponent {
  files: any[] = [];
  formation!: Formation;
  constructor(private http: HttpClient) {}

  // Configuration du serveur pour FilePond
  serverOptions = {
    process: (fieldName: any, file: File, metadata: any, load: any, error: any, progress: any, abort: any) => {
      console.log('Uploading file:', file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'rbzoyji0'); // Ton upload preset Cloudinary
      formData.append('cloud_name', 'dlj8nno5x');   // Ton nom Cloudinary
      formData.append('publicid', file.name);

      this.http.post('https://api.cloudinary.com/v1_1/dlj8nno5x/image/upload', formData)
        .subscribe({
          next: (response: any) => {
            console.log('Upload success:', response);
            this.formation.image = response.secure_url; // Stocker l'URL de l'image
            load(response);
          },
          error: (err) => {
            console.error('Upload failed:', err);
            error('Upload failed');
            abort();
          }
        });
    }
  };


}
