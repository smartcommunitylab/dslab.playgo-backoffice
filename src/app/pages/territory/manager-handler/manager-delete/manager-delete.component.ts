import { Component, OnInit, Inject, Input } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConsoleControllerService } from 'src/app/core/api/generated/controllers/consoleController.service';
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
    private managerService: ConsoleControllerService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onNoClick(event: any): void {
    this.dialogRef.close(false);
  }

  delete(){
    this.msgErrorDelete= "";
    try{
      this.managerService.removeTerritoryManagerUsingDELETE(this.email,this.territoryId).subscribe(
        () =>{
          this.dialogRef.close(true);
          this._snackBar.open("Manager "+this.email+" eliminato", "close");
        },
        (error) =>{
          if(!!error.error && !!error.error.ex){
            this.error = error.error.ex.toString();
          }else{
            this.error = error.toString();
          }
          this.msgErrorDelete = "cannotDeleteTerritory";
        }
      );
    }catch(error){
      if(!!error.error && !!error.error.ex){
        this.error = error.error.ex.toString();
      }else{
        this.error = error.toString();
      }
      this.msgErrorDelete = "cannotDeleteTerritory";
    }
  }

}
