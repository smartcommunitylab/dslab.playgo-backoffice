import { Component, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from "@angular/material/core";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { TranslateService } from "@ngx-translate/core";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { NotificationControllerService } from "src/app/core/api/generated/controllers/notificationController.service";
import { Announcement } from "src/app/core/api/generated/model/announcement";
import { AnnouncementClass } from "src/app/shared/classes/announcment-class";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";
import { CHANNELS_COMMUNICATION, MY_DATE_FORMATS } from "src/app/shared/constants/constants";

@Component({
  selector: "app-communication-add",
  templateUrl: "./communication-add.component.html",
  styleUrls: ["./communication-add.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class CommunicationAddComponent implements OnInit {
  territoryId: string;
  validatingForm: FormGroup;
  territories: string[] = ["aa", "bb"];
  channels: string[] = CHANNELS_COMMUNICATION;
  listCampaings: string[] = [];
  errorMsgValidation = "";
  constructor(
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private campaignService: CampaignControllerService,
    private _snackBar: MatSnackBar,
    private communicationService: NotificationControllerService,
    public dialogRef: MatDialogRef<CommunicationAddComponent>
  ) {}

  ngOnInit(): void {
    this.territories.push(this.territoryId);
    this.validatingForm = this.formBuilder.group({
      territoryId: new FormControl("", [Validators.required]),
      campaignId: new FormControl("", [Validators.required]),
      channels: new FormControl("", [Validators.required]),
      briefDescription: new FormControl("", [Validators.required]),
      richDescription: new FormControl(""),
      activityDate: new FormControl(""),
      dateFrom: new FormControl("", [Validators.required]),
      dateTo: new FormControl("", [Validators.required]),
      users: new FormControl(""),
      title: new FormControl("", [Validators.required]),
    });
    this.validatingForm.patchValue({
      territoryId: this.territoryId,
    });
    this.campaignService
      .getCampaignsUsingGET({ territoryId: this.territoryId })
      .subscribe((campaigns) => {
        campaigns.forEach((item) => {
          this.listCampaings.push(item.campaignId);
        });
      });
  }

  onNoClick(event: any, body: any): void {
    this.dialogRef.close(body);
  }

  validate() {
    if (this.validatingForm.valid) {
      const dateFrom: number = this.validatingForm.get("dateFrom").value
        ? this.validatingForm.get("dateFrom").value.valueOf()
        : undefined;
      const dateTo: number = this.validatingForm.get("dateTo").value
        ? this.validatingForm.get("dateTo").value.valueOf()
        : undefined;
      if (!this.validDates(dateFrom, dateTo)) {
        this.errorMsgValidation = "dateNotValid";
        return;
      }

      let announce: any;
      announce =
        this.validatingForm.get("channels").value === "email"
          ? Announcement.ChannelsEnum.Email
          : this.validatingForm.get("channels").value === "push"
          ? Announcement.ChannelsEnum.Push
          : Announcement.ChannelsEnum.News;
      const campaignId = this.validatingForm.get("campaignId").value
        ? this.validatingForm.get("campaignId").value
        : undefined;
      const channels = this.tranformChannels();
      let body:AnnouncementClass = new AnnouncementClass();
      body.channels = channels;
      body.description = this.validatingForm.get("briefDescription").value
        ? this.validatingForm.get("briefDescription").value
        : "";
      body.from = dateFrom.toString();
      body.html = this.validatingForm.get("richDescription").value
        ? this.validatingForm.get("richDescription").value
        : "";
      body.players = this.validatingForm.get("users").value
        ? this.validatingForm.get("users").value.split(",")
        : [];
      body.timestamp = new Date().valueOf();
      body.title = this.validatingForm.get("title").value
        ? this.validatingForm.get("title").value
        : "";
      body.to = dateTo.toString();
      this.communicationService
        .notifyCampaignUsingPOST({
          territoryId: this.territoryId,
          body: body,
          campaignId: campaignId,
        })
        .subscribe(
          (res) => {
            this.onNoClick("", body);
            this._snackBar.openFromComponent(SnackbarSavedComponent,
              {
               data:{displayText: "savedData"},
               duration: 4999
             });
          },
          (error) => {
            console.error(error);
            error
              ? error.error.ex
                ? (this.errorMsgValidation =
                    this.translate.instant("error") + ": " + error.error.ex)
                : this.translate.instant("errorNotFound")
              : this.translate.instant("errorNotFound");
          }
        );
    }else{
      this.errorMsgValidation = this.translate.instant("fillAllfields");
    }
  }

  get descriptionRichControl() {
    return this.validatingForm.controls.richDescription as FormControl;
  }

  emailEnabled(): boolean {
    if (!!!this.validatingForm.get("channels").value) {
      return false;
    }
    const list: string[] = this.validatingForm.get("channels").value;
    const res = list.find((element) => element === CHANNELS_COMMUNICATION[0]);
    if (!!res) {
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

  tranformChannels(): Announcement.ChannelsEnum[] {
    let result: Announcement.ChannelsEnum[] = [];
    let list = this.validatingForm.get("channels").value;
    for (let el of list) {
      if (el === "email") {
        result.push(Announcement.ChannelsEnum.Email);
      }

      if (el === "push") {
        result.push(Announcement.ChannelsEnum.Push);
      }

      if (el === "news") {
        result.push(Announcement.ChannelsEnum.News);
      }
    }
    return result;
  }
}
