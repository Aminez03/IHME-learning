import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { Categorie } from 'src/Models/Categorie';
import { CategorieService } from 'src/Services/categorie.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ModalCategorieComponent } from '../modal-categorie/modal-categorie.component';
import { ConfirmdialogComponent } from '../confirmdialog/confirmdialog.component';

@Component({
  selector: 'app-categorie',
  templateUrl: './categorie.component.html',
  styleUrls: ['./categorie.component.css']
})
export class CategorieComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'nomCategorie', 'action'];
  dataSource: Categorie[] = [];
  allCategories: Categorie[] = [];

  paginatedCategories: Categorie[] = [];
  pageSize = 5;
  pageIndex = 0;
  pageSizeOptions: number[] = [5, 10, 15];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private CS: CategorieService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.fetchCategories();
  }

  ngAfterViewInit(): void {
    this.paginator?.page.subscribe(() => {
      this.pageIndex = this.paginator.pageIndex;
      this.pageSize = this.paginator.pageSize;
      this.updatePaginatedCategories();
    });
  }

  fetchCategories(): void {
    this.CS.getAll().subscribe((data) => {
      this.allCategories = data;
      this.dataSource = data;
      this.updatePaginatedCategories();
    });
  }

  updatePaginatedCategories(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedCategories = this.dataSource.slice(startIndex, endIndex);
  }

  openAdd(): void {
    let dialogRef = this.dialog.open(ModalCategorieComponent, {
      height: '300px',
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.nomCategorie?.trim()) {
        this.CS.create(data).subscribe(() => {
          this.snackBar.open('✅ Catégorie ajoutée avec succès !', 'Fermer', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          });
          this.fetchCategories();
        });
      } else if (data) {
        this.snackBar.open('⚠️ Veuillez renseigner un nom de catégorie.', 'Fermer', {
          duration: 3000,
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  openEdit(categorie: Categorie): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.data = categorie;

    let dialogRef = this.dialog.open(ModalCategorieComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((data) => {
      if (data && data.nomCategorie?.trim()) {
        this.CS.update(categorie.id, data).subscribe(() => {
          this.snackBar.open('✏️ Catégorie modifiée avec succès', 'Fermer', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          });
          this.fetchCategories();
        });
      }
    });
  }

  deleteCategorie(id: number): void {
    let dialogRef = this.dialog.open(ConfirmdialogComponent, {
      height: '200px',
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.CS.delete(id).subscribe(() => {
          this.snackBar.open('🗑️ Catégorie supprimée', 'Fermer', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: ['snackbar-success']
          });
          this.fetchCategories();
        });
      }
    });
  }
}
