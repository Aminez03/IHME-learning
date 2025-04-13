import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormationService } from 'src/Services/formation.service';
import { AuthService } from '../authentification/auth.service';
import * as moment from 'moment';

@Component({
  selector: 'app-modal-session',
  templateUrl: './modal-session.component.html',
  styleUrls: ['./modal-session.component.css']
})
export class ModalSessionComponent implements OnInit {
  displayedColumns: string[] = ['id', 'nomFormation', 'dateDebut', 'nombreInscrits', 'nombreCours', 'dateFin', 'capacite', 'formateur', 'actions'];

  form!: FormGroup;
  formations: any[] = [];
  formateurs: any[] = [];
  errorMessage: string = '';
  token: string = '';

  constructor(
    public dialogRef: MatDialogRef<ModalSessionComponent>,
    @Inject(MAT_DIALOG_DATA) data: any,
    private FS: FormationService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {
    if (data) {
      this.form = new FormGroup({
        dateDebut: new FormControl(data.dateDebut, [Validators.required]),
        dateFin: new FormControl(data.dateFin, [Validators.required]),
        statut: new FormControl(data.statut, [Validators.required]),
        capacite: new FormControl(data.capacite, [Validators.required, Validators.min(1)]),
        nombreInscrits: new FormControl(data.nombreInscrits, [Validators.required, Validators.min(0)]),
        nombreCours: new FormControl(data.nombreCours, [Validators.required, Validators.min(0)]),
        formationID: new FormControl(data.formationID, [Validators.required]),
        formateurID: new FormControl(data.formateurID, [Validators.required])
      });
    } else {
      this.form = new FormGroup({
        dateDebut: new FormControl(null, [Validators.required]),
        dateFin: new FormControl(null, [Validators.required]),
        statut: new FormControl(null, [Validators.required]),
        capacite: new FormControl(null, [Validators.required, Validators.min(1)]),
        nombreInscrits: new FormControl(null, [Validators.required, Validators.min(0)]),
        nombreCours: new FormControl(null, [Validators.required, Validators.min(0)]),
        formationID: new FormControl(null, [Validators.required]),
        formateurID: new FormControl(null, [Validators.required])
      });
    }
  }

  ngOnInit(): void {
    this.token = localStorage.getItem('CC_Token') || '';
    this.fetchData();
    this.fetchUsersByRole('formateur');
  }

  fetchData(): void {
    this.FS.getAllFormations().subscribe(
      (data) => this.formations = data,
      (error) => {
        this.showError('Erreur lors de la récupération des formations.');
        console.error('Erreur:', error);
      }
    );
  }

  fetchUsersByRole(role: string): void {
    this.authService.getUsersByRole(role, this.token).subscribe(
      (response) => {
        if (response.success) {
          this.formateurs = response.users;
        } else {
          this.showError(response.message);
        }
      },
      (error) => {
        this.showError(error.error?.message || 'Une erreur est survenue.');
        console.error('Erreur:', error);
      }
    );
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
      this.showSuccess('Session enregistrée avec succès !');
    } else {
      this.showError('Veuillez remplir tous les champs obligatoires correctement.');
    }
  }

  close() {
    this.dialogRef.close();
  }

  onDateChange(event: any, type: string) {
    if (event.value) {
      const formattedDate = moment(event.value).format('YYYY-MM-DD');
      if (type === 'start') {
        this.form.get('dateDebut')?.setValue(formattedDate);
      } else {
        this.form.get('dateFin')?.setValue(formattedDate);
      }
    }
  }

  // Snackbar methods
  showSuccess(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['success-snackbar']
    });
  }

  showError(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
      panelClass: ['error-snackbar']
    });
  }
}