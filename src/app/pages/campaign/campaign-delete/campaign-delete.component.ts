import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CampaignControllerService } from 'src/app/core/api/generated/controllers/campaignController.service';
import { SnackbarSavedComponent } from 'src/app/shared/components/snackbar-saved/snackbar-saved.component';

@Component({
  selector: 'app-campaign-delete',
  templateUrl: './campaign-delete.component.html',
  styleUrls: ['./campaign-delete.component.scss']
})
export class CampaignDeleteComponent implements OnInit {

  campaignId: string;
  msgError: string;
  recivedError: string;
  constructor(
    private campaignService: CampaignControllerService,
    private translate: TranslateService,
     public dialogRef: MatDialogRef<CampaignDeleteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  onNoClick(event: any,id?: String): void {
    this.dialogRef.close(id);
  }

  delete(){
      this.campaignService.deleteCampaignUsingDELETE(this.campaignId).subscribe(()=>{
        this.onNoClick('',this.campaignId);
        this._snackBar.openFromComponent(SnackbarSavedComponent,
          {
           data:{displayText: 'deletedCampaign'},
           duration: 4999
         });
      }, 
      (error) =>{
        this.msgError = 'cannotDeleteCampaign';
        if(!!error && !!error.error && !!error.error.ex){
          this.recivedError = error.error.ex;
        }else{
          this.recivedError = error;
        }
      }
      );
  }
}
