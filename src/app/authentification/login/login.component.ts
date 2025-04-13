// src/app/components/login/login.component.ts

import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  loading = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      adresseMail: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const { adresseMail, password } = this.loginForm.value;

    this.authService.signin({ adresseMail, password }).subscribe({
      next: (response) => {
        if (response.success) {
          if (response.user.isActive) {
            localStorage.setItem("CC_Token", response.token);
            localStorage.setItem("role", response.user.role);
            localStorage.setItem("user", response.user);
            localStorage.setItem("formationSessionID", response.user.formationSessionID);
            if (response.user.role === 'admin') {
              this.router.navigate(['/formations']);
            } else {
              this.router.navigate(['/formations']);
            }
          } else {
            alert("Account is not activated yet.");
          }
        } else {
          alert("Invalid credentials.");
        }
      },
      error: (err) => {
        console.error('Échec de connexion:', err);
      
        // Détecter le type d'erreur et afficher un message approprié
        let message = 'Une erreur est survenue. Veuillez réessayer.';
        if (err.status === 401) {
          message = 'Email ou mot de passe incorrect.';
        }
        else if (err.status === 403){

          message = "Votre compte n'est pas encore activé";
          }
         else if (err.status === 500) {
          message = 'Erreur serveur. Veuillez réessayer plus tard.';
        }
      
        // Affichage du snackbar avec un style personnalisé
        this.snackBar.open(message, 'Fermer', {
          duration: 4000, // Augmenter la durée pour laisser le temps de lire
          panelClass: ['error-snackbar'], // Ajouter un style personnalisé
          horizontalPosition: 'center', // Centrer horizontalement
          verticalPosition: 'top' // Afficher en haut pour plus de visibilité
        });
      }
      
    });
  }
}
