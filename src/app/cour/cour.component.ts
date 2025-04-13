import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Cour } from 'src/Models/Cour';
import { CourService } from 'src/Services/cour.service';
import { ModalCourComponent } from '../modal-cour/modal-cour.component';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../authentification/auth.service';
import { SessionProgression } from 'src/Models/SessionProgression';
import { SessionProgressionService } from 'src/Services/session-progression.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-cour',
  templateUrl: './cour.component.html',
  styleUrls: ['./cour.component.css']
})
export class CourComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'titre', 'description', 'formationId', 'action'];
  dataSource: Cour[] = [];
  paginatedCours: Cour[] = [];
  pageSize = 3;
  pageIndex = 0;
  pageSizeOptions: number[] = [3, 6, 9, 12];
  progression?: SessionProgression;
  progressionValue = 0;
  mode: 'determinate' | 'indeterminate' = 'indeterminate';
  sessionid?: string | null;
  showAlert: boolean = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private courService: CourService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private authService: AuthService,
    private sessionProgressionService: SessionProgressionService
  ) {}

  ngOnInit(): void {
    this.fetchData();
    const sessionId = this.route.snapshot.params['id'] || localStorage.getItem('formationSessionID');
    this.sessionid=sessionId;
    if (sessionId) {
      this.loadSessionAndProgression(Number(sessionId));
    } else {
      console.error('Aucun ID de session trouvé.');
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.paginator.page.subscribe(() => {
        this.pageIndex = this.paginator.pageIndex;
        this.pageSize = this.paginator.pageSize;
        this.updatePaginatedCours();
      });
    }
  }

  fetchData(): void {
    const formationSessionId = this.route.snapshot.params['id'] || localStorage.getItem('formationSessionID');

    if (!formationSessionId) {
      console.error("Aucun ID de session trouvé.");
      return;
    }

    this.courService.getAllCoursBySessionId(formationSessionId).subscribe({
      next: (data) => {
        if (Array.isArray(data)) {
          this.dataSource = data;
        } else {
          console.error('Les données reçues ne sont pas un tableau.');
          this.dataSource = [];
        }
        this.updatePaginatedCours();
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des cours:', err);
        this.dataSource = [];
        this.updatePaginatedCours();
      }
    });
  }

  updatePaginatedCours(): void {
    if (this.paginator) {
      const maxPageIndex = Math.ceil(this.dataSource.length / this.pageSize) - 1;
      if (this.pageIndex > maxPageIndex) {
        this.pageIndex = 0;
        this.paginator.pageIndex = 0;
      }
    }
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCours = this.dataSource.slice(startIndex, endIndex);
  }

  open(): void {
    const dialogRef = this.dialog.open(ModalCourComponent, {
      height: '500px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data) {
        this.courService.addCours(data).subscribe(() => {
          console.log('Cours ajouté avec succès');
          this.fetchData();
        });
      }
    });
  }

  openEdit(id: number): void {
    this.courService.getCoursById(id).subscribe((cour) => {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.data = cour;

      const dialogRef = this.dialog.open(ModalCourComponent, dialogConfig);

      dialogRef.afterClosed().subscribe((data) => {
        if (data) {
          this.courService.updateCours(id, data).subscribe(() => {
            console.log('Cours modifié avec succès');
            this.fetchData();
          });
        }
      });
    });
  }

  deleteCours(id: number): void {
    const dialogRef = this.dialog.open(ConfirmdialogComponent, {
      height: '200px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.courService.deleteCours(id).subscribe(() => {
          console.log('Cours supprimé');
          this.fetchData();
        });
      }
    });
  }

  isFormateur(): boolean {
    return this.authService.isFormateur();
  }
  iscandidat():boolean{
    return this.authService.iscandidat();
  }



  loadSessionAndProgression(sessionId: number): void {
    forkJoin({
      progression: this.sessionProgressionService.getProgression(sessionId)
    }).subscribe({
      next: ({ progression }) => {
        this.progression = progression;
        this.calculateProgressionPercentage();
        this.mode = 'determinate';
      },
      error: (err) => console.error('Erreur lors du chargement des données de session et progression.', err)
    });
  }

  private calculateProgressionPercentage(): void {
    const totalCourses = this.dataSource.length || 1;
    this.progressionValue = this.progression ? Math.round((this.progression.progression / totalCourses) * 100) : 0;
  }
}
