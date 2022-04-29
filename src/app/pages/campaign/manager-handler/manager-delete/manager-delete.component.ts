import { Component, OnInit, Inject, Input } from '@angular/core';

import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatSnackBar } from '@angular/material/snack-bar';
import { ManagerHandlerService } from 'src/app/shared/services/manager-handler.service';
@Component({
  selector: 'app-manager-delete',
  templateUrl: './manager-delete.component.html',
  styleUrls: ['./manager-delete.component.scss']
})
export class ManagerDeleteComponent implements OnInit {

  @Input() campaignId:string;
  @Input() email:string;
  msgErrorDelete:string;

  constructor(    public dialogRef: MatDialogRef<ManagerDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private managerService: ManagerHandlerService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onNoClick(event: any): void {
    this.dialogRef.close(false);
  }

  delete(){
    this.msgErrorDelete= "";
    try{
      this.managerService.deleteManagerCampaign(this.campaignId,this.email).subscribe(
        () =>{
          this.dialogRef.close(true);
          this._snackBar.open("Manager "+this.email+" eliminato", "close");
        },
        (error) =>{
          this.msgErrorDelete = "There was an error while deliting the menager: " + error;
        }
      );
    }catch(error){
      this.msgErrorDelete = "There was an error while deliting the menager: " + error;
    }
  }

}
