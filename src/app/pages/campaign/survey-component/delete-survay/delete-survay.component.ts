import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CampaignControllerService } from 'src/app/core/api/generated/controllers/campaignController.service';
import { SnackbarSavedComponent } from 'src/app/shared/components/snackbar-saved/snackbar-saved.component';

@Component({
  selector: 'app-delete-survay',
  templateUrl: './delete-survay.component.html',
  styleUrls: ['./delete-survay.component.scss']
})
export class DeleteSurvayComponent implements OnInit {
  campaignId:string;
  surveyName:string;
  msgError: string;
  recivedError: string;

  constructor(
    private translate: TranslateService,
    private survayService: CampaignControllerService,
     public dialogRef: MatDialogRef<DeleteSurvayComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
  }

  onNoClick(event: any,deletee: boolean): void {
    this.dialogRef.close(deletee);
  }

  delete(){
      const text = this.translate.instant('deleted');
      this._snackBar.openFromComponent(SnackbarSavedComponent,
        {
         data:{displayText: text},
         duration: 4999
       });
    this.onNoClick('',true);
  }

}
