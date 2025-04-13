import { Component } from '@angular/core';
import { CertificatService } from 'src/Services/certificat.service';

@Component({
  selector: 'app-certificat',
  templateUrl: './certificat.component.html',
  styleUrls: ['./certificat.component.css']
})
export class CertificatComponent {
  certificats: any[] = [];
  selectedCertificat: any;
  constructor(private certificatService: CertificatService) {}
  ngOnInit(): void {
    this.fetchCertificats();
  }

  fetchCertificats(): void {
    this.certificatService.getAllCertificats().subscribe(data => {
      this.certificats = data;
    });
  }

  fetchCertificat(id: number): void {
    this.certificatService.getCertificatById(id).subscribe(data => {
      this.selectedCertificat = data;
    });
  }
}
