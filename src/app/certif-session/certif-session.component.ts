import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import jsPDF from 'jspdf';
import { Formation } from 'src/Models/Formation';
import { CertificatService } from 'src/Services/certificat.service';
import { FormationService } from 'src/Services/formation.service';

@Component({
  selector: 'app-certif-session',
  templateUrl: './certif-session.component.html',
  styleUrls: ['./certif-session.component.css']
})
export class CertifSessionComponent implements OnInit {
  formation?: Formation;
  certificat: any = undefined;
  formationID: any;

  constructor(
    private certificatService: CertificatService,
    private route: ActivatedRoute,
    private FS: FormationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCertificat();
  }

  goHome(): void {
    this.router.navigate(['/dashboard']);
  }

  isCertificatValide(certificat: any): boolean {
    const statut = (certificat.statut || '').toLowerCase().trim();
    const note = Number(certificat.note);
    return statut === 'validé' && note >= 50;
  }

  loadCertificat(): void {
    const certificatId = this.route.snapshot.params['id'];
    this.certificatService.getCertificatById(certificatId).subscribe({
      next: (data) => {
        console.log("Certificat reçu :", data);

        if (!this.isCertificatValide(data)) {
          console.warn('Certificat non valide (échec ou statut invalide).');
          this.certificat = null;
          return;
        }

        this.certificat = data;
        this.formationID = data.formation_session.formationID;
        this.fetchFormation();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération du certificat:', err);
        this.certificat = null;
      }
    });
  }

  fetchFormation(): void {
    if (this.formationID) {
      this.FS.getFormationById(this.formationID).subscribe({
        next: (data) => {
          this.formation = data.formation;
        },
        error: (err) => {
          console.error('Erreur lors de la récupération de la formation:', err);
        }
      });
    }
  }

  generatePDF(): void {
    
    if (!this.certificat) return;

    const doc = new jsPDF('portrait', 'mm', 'a4');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(24);
    doc.text('Certificat de Réussite', 70, 30);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Ce certificat est décerné à :`, 20, 50);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(`${this.certificat.candidat.nom} ${this.certificat.candidat.prenom}`, 20, 60);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Pour avoir complété avec succès la formation :`, 20, 75);
    doc.setFont('helvetica', 'bold');
    doc.text(`${this.formation?.nomFormation || 'Formation inconnue'}`, 20, 85);

    doc.setFont('helvetica', 'normal');
    doc.text(`Date d'obtention : ${this.certificat.dateObtention}`, 20, 100);
    doc.text(`Note : ${this.certificat.note}`, 20, 110);
    doc.text(`Statut : ${this.certificat.statut}`, 20, 120);
    doc.text(`Date de création : ${this.certificat.created_at}`, 20, 130);

    doc.save(`certificat_${this.certificat.candidat.nom}.pdf`);
  }
  
}
