import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  contact = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  onSubmit(): void {
    const formData = {
      name: this.contact.name,
      email: this.contact.email,
      subject: this.contact.subject,
      message: this.contact.message,
      _replyto: this.contact.email // Formspree uses _replyto for the sender's email
    };

    this.http
      .post('https://formspree.io/f/mayggzkb', formData, {
        headers: { 'Content-Type': 'application/json' }
      })
      .subscribe({
        next: () => {
          this.snackBar.open('Votre message a été envoyé avec succès !', 'Fermer', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar']
          });
          // Reset the form
          this.contact = { name: '', email: '', subject: '', message: '' };
        },
        error: () => {
          this.snackBar.open('Une erreur s\'est produite lors de l\'envoi de votre message.', 'Fermer', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['custom-snackbar-error']
          });
        }
      });
  }
}