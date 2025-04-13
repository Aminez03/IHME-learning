import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmdialog',
  templateUrl: './confirmdialog.component.html',
  styleUrls: ['./confirmdialog.component.css']
})
export class ConfirmdialogComponent {
  // forcage du type
  // composant => boite  
  constructor(public dialogRef: MatDialogRef<ConfirmdialogComponent>) { }
}
