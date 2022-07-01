import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-snackbar-saved',
  templateUrl: './snackbar-saved.component.html',
  styleUrls: ['./snackbar-saved.component.scss']
})
export class SnackbarSavedComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any,
  public snackBarRef: MatSnackBarRef<SnackbarSavedComponent>) { }

  ngOnInit(): void {
  }

  close(){
    this.snackBarRef.dismiss();
  }

}
