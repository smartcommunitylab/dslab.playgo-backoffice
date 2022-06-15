import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private _snackBar: MatSnackBar,
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
    this.campaignService.getCampaignsUsingGET({territoryId: this.territoryId}).subscribe((campaigns)=>{
      campaigns.forEach((item)=>{this.listCampaings.push(item.campaignId)});
    });
  }

  onNoClick(event: any,body: any): void {
    this.dialogRef.close();
  }

  validate(){
    if(this.validatingForm.valid){
      const dateFrom:number = this.validatingForm.get("dateFrom").value ? this.validatingForm.get("dateFrom").value.valueOf() : undefined;
      const dateTo:number = this.validatingForm.get("dateTo").value? this.validatingForm.get("dateTo").value.valueOf() : undefined;
      console.log("date: ",dateFrom);
      if (!!dateFrom && !!dateTo){
        if(!this.validDates(
          dateFrom,
          dateTo
        )
      ) {
        this.msgError = "dateNotValid";
        return;
      }
      }

      let announce: any;
      announce = this.validatingForm.get("channels").value === 'email' ? Announcement.ChannelsEnum.Email : (this.validatingForm.get("channels").value === 'push' ? Announcement.ChannelsEnum.Push : Announcement.ChannelsEnum.News); 
      const campaignId =  this.validatingForm.get('campaignId').value ? this.validatingForm.get('campaignId').value : undefined;
      const channels = this.tranformChannels();
      const body = {
        "channels": channels,
        "description": this.validatingForm.get("briefDescription").value ? this.validatingForm.get("briefDescription").value : undefined ,
        "from": dateFrom.toString() ,
        "html": this.validatingForm.get("richDescription").value ? this.validatingForm.get("richDescription").value : undefined ,
        "players": this.validatingForm.get("users").value ? this.validatingForm.get("users").value.split(',') : undefined ,
        "timestamp": new Date().getMilliseconds(),
        "title": this.validatingForm.get("title").value ? this.validatingForm.get("title").value : undefined,
        "to": dateTo.toString(),
      };
      console.log("body: ", body);
      this.communicationService.notifyCampaignUsingPOST({territoryId: this.territoryId,body: body ,campaignId: campaignId}).subscribe((res)=>{
        this.onNoClick("", body);
        this._snackBar.open(
          this.translate.instant("savedData"),
          this.translate.instant("close")
        );
      },
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

  validDates(start: number, end: number) {
    if (start < end) {
      return true;
    }
    return false;
  }

  tranformChannels(): Announcement.ChannelsEnum[]{
    let result: Announcement.ChannelsEnum[] = [];
    let list = this.validatingForm.get("channels").value;
    for(let el of list){
      if(el ==='email'){
        result.push(Announcement.ChannelsEnum.Email);
      }

      if(el ==='push'){
        result.push(Announcement.ChannelsEnum.Push);
      }

      if(el ==='announcement'){
        result.push(Announcement.ChannelsEnum.News);
      }
    }
    return result;
  }

}
