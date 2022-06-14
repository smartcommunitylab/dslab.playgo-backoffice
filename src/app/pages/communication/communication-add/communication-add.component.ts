import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CampaignControllerService } from 'src/app/core/api/generated/controllers/campaignController.service';
import { NotificationControllerService } from 'src/app/core/api/generated/controllers/notificationController.service';
import { Announcement } from 'src/app/core/api/generated/model/announcement';
import { CHANNELS_COMMUNICATION } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-communication-add',
  templateUrl: './communication-add.component.html',
  styleUrls: ['./communication-add.component.scss']
})
export class CommunicationAddComponent implements OnInit {
  
  territoryId:string;
  validatingForm: FormGroup;
  territories: string[] = ["aa","bb"];
  channels: string[] = CHANNELS_COMMUNICATION;
  listCampaings: string[] = [];
  msgError = "";
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private campaignService: CampaignControllerService,
    private communicationService: NotificationControllerService,
    public dialogRef: MatDialogRef<CommunicationAddComponent>,) { }

  ngOnInit(): void {
    this.territories.push(this.territoryId);
    this.validatingForm = this.formBuilder.group({
      territoryId: new FormControl("", [Validators.required]),
      campaignId: new FormControl(""),
      channels: new FormControl("", [Validators.required]),
      briefDescription: new FormControl("", [Validators.required]),
      richDescription:new FormControl(""),
      activityDate:new FormControl(""),
      dateFrom:new FormControl(""),
      dateTo:new FormControl(""),
      users:new FormControl(""),
      title:new FormControl("", [Validators.required]),
    });
    this.validatingForm.patchValue({
      territoryId: this.territoryId,
    });
    this.campaignService.getCampaignsUsingGET(this.territoryId).subscribe((campaigns)=>{
      campaigns.forEach((item)=>{this.listCampaings.push(item.campaignId)});
    });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  validate(){
    if(this.validatingForm.valid){
      let announce: any;
      announce = this.validatingForm.get("channels").value === 'email' ? Announcement.ChannelsEnum.Email : (this.validatingForm.get("channels").value === 'push' ? Announcement.ChannelsEnum.Push : Announcement.ChannelsEnum.News); 
      const campaignId =  this.validatingForm.get('campaignId').value ? this.validatingForm.get('campaignId').value : undefined;
      this.communicationService.notifyCampaignUsingPOST(this.territoryId,campaignId).subscribe((res)=>{},
      (error)=>{
        console.log(error);
        error ? (error.error.ex ? this.msgError = this.translate.instant('error') +": "+ error.error.ex :  this.translate.instant('errorNotFound') ) : this.translate.instant('errorNotFound');
      });
    }
  }

  get descriptionRichControl() {
    return this.validatingForm.controls.richDescription as FormControl;
  }

  emailEnabled():boolean{
    if(!!!this.validatingForm.get('channels').value){
      return false;
    }
    const list : string[] = this.validatingForm.get('channels').value;
    const res = list.find((element)=>element === CHANNELS_COMMUNICATION[0]);
    if(!!res){
      return true;
    }
    return false;

  }

}
