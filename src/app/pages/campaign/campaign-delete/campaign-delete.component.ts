import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CampaignService } from 'src/app/shared/services/campaign-service.service';

@Component({
  selector: 'app-campaign-delete',
  templateUrl: './campaign-delete.component.html',
  styleUrls: ['./campaign-delete.component.scss']
})
export class CampaignDeleteComponent implements OnInit {

  campaignId: string;
  msgError: string;
  recivedError: string;
  constructor(private campaignService: CampaignService, public dialogRef: MatDialogRef<CampaignDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onNoClick(event: any,id?: String): void {
    this.dialogRef.close(id);
  }

  delete(){
    try{
      this.campaignService.delete(this.campaignId).subscribe(()=>{
        this.onNoClick('',this.campaignId);
        this._snackBar.open("Campagna eliminata", "close");
      }, 
      (error) =>{
        this.msgError = 'cannotDeleteCampaign';
        if(!!error.error && !!error.error.ex){
          this.recivedError = error.error.ex;
        }else{
          this.recivedError = error;
        }
        // this._snackBar.open("Territorio cannot be delited because:"+ error.error.ex, "close");
      }
      );
    }catch(e){
      this.msgError = 'cannotDeleteCampaign';
      this.recivedError = e;
      // this._snackBar.open("Error durante cancellazione", "close");
    }
  }
}
