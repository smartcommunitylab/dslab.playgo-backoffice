import { Component, OnInit, Inject, Input } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { ConsoleControllerService } from 'src/app/core/api/generated/controllers/consoleController.service';
import { SnackbarSavedComponent } from 'src/app/shared/components/snackbar-saved/snackbar-saved.component';
@Component({
  selector: 'app-manager-delete',
  templateUrl: './manager-delete.component.html',
  styleUrls: ['./manager-delete.component.scss']
})
export class ManagerDeleteTerritoryComponent implements OnInit {

  @Input() territoryId:string;
  @Input() email:string;
  msgErrorDelete:string;
  error:string;

  constructor(    public dialogRef: MatDialogRef<ManagerDeleteTerritoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translate: TranslateService,
    private managerService: ConsoleControllerService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onNoClick(event: any): void {
    this.dialogRef.close(false);
  }

  delete(){
    this.dialogRef.close(true);
    const text = this.translate.instant('deletedManager') + ': ' + this.email;
    this._snackBar.openFromComponent(SnackbarSavedComponent,
      {
       data:{displayText: text},
       duration: 4999
     });
  }

}
