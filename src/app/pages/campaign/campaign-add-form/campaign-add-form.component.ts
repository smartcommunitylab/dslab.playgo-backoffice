import { Component, Inject, Input, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MapPoint } from "src/app/shared/classes/map-point";
import { TerritoryClass } from "src/app/shared/classes/territory-class";
import { MatSnackBar } from "@angular/material/snack-bar";
import {
  CampaignClass,
  ImageClass,
  ValidationData,
} from "src/app/shared/classes/campaing-class";
import {
  BASE64_SRC_IMG,
  CONST_LANGUAGES_SUPPORTED,
  DAILY_LIMIT,
  DEFAULT_SURVEY_KEY,
  PERIODS_KEY,
  LANGUAGE_DEFAULT,
  MONTHLY_LIMIT,
  MY_DATE_FORMATS,
  PREFIX_SRC_IMG,
  TERRITORY_ID_LOCAL_STORAGE_KEY,
  TYPE_CAMPAIGN,
  WEEB_HOOK_EVENT,
  WEEKLY_LIMIT,
  START_YEAR_FIXED,
  END_YEAR_FIXED,
  CHALLENGE_PLAYER_PROPOSER,
  CHALLENGE_PLAYER_ASSIGNED,
  HOURS_CONST,
  DAY_WEEK_KEY_VALUE,
} from "src/app/shared/constants/constants";
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from "@angular/animations";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import * as _moment from "moment";
import { Moment } from "moment";
import { Logo } from "src/app/shared/classes/logo-class";
import { TerritoryControllerService } from "src/app/core/api/generated/controllers/territoryController.service";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import {
  CampaignDetailClass,
  DetailsForAddModifyModule,
} from "src/app/shared/classes/campaign-details-class";
import { CampaignDetail } from "src/app/core/api/generated/model/campaignDetail";
import { Image } from "src/app/core/api/generated/model/image";
import { DEFAULT_LANGUAGE, TranslateService } from "@ngx-translate/core";
import { ConfirmCancelComponent } from "./confirm-cancel/confirm-cancel.component";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";
import { CampaignWebhook } from "src/app/core/api/generated/model/campaignWebhook";
import { DateTime, Settings } from "luxon";

const moment = _moment;

@Component({
  selector: "app-campaign-add-form",
  templateUrl: "./campaign-add-form.component.html",
  styleUrls: ["./campaign-add-form.component.scss"],
  animations: [
    trigger("bodyExpansion", [
      state("collapsed, void", style({ height: "0px", visibility: "hidden" })),
      state("expanded", style({ height: "*", visibility: "visible" })),
      transition(
        "expanded <=> collapsed, void => collapsed",
        animate("225ms cubic-bezier(0.4, 0.0, 0.2, 1)")
      ),
    ]),
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },

    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
  ],
})
export class CampaignAddFormComponent implements OnInit {
  @Input() type: string; // can be add or modify
  quillContent = "";
  meansSelected: string[] = [];
  selectedLimits: SelectedLimits;
  validatingForm: FormGroup;
  campaignCreated: CampaignClass;
  campaignUpdated: CampaignClass;
  territorySelected: TerritoryClass;
  selectedLogo: Image;
  selectedBanner: Image;
  typeCampaign = TYPE_CAMPAIGN;
  means: string[];
  errorMsgValidation: string;
  stateDescription: string = "collapsed";
  expandableDescription: boolean = true; 
  details: DetailsForAddModifyModule[] = [];
  detailsType: any[];
  // stateRules: string = "collapsed";
  // statePrivacy: string = "collapsed";
  PREFIX_SRC_IMG_C = PREFIX_SRC_IMG;
  BASE64_SRC_IMG_C = BASE64_SRC_IMG;
  uploadImageForModifyLogo: boolean = false;
  blobImageUploadLogo: Blob;
  uploadImageForModifyBanner: boolean = false;
  blobImageUploadBanner: Blob;
  activeValue = false;
  languageDefault: any;
  languagesSupported = CONST_LANGUAGES_SUPPORTED;
  languageSelected: string;
  weebHooksEventsList: string[] = [];
  hours_const = HOURS_CONST;
  day_week_const =  DAY_WEEK_KEY_VALUE;
  disabledControl = true;

  @Input() set formTerritory(value: CampaignClass) {
    this.campaignUpdated = value;
    console.log(this.campaignUpdated.specificData);
    this.selectedLogo = value.logo;
    this.selectedBanner = value.banner;
    // this.selectedLogo = new ImageClass();
    // this.selectedLogo.contentType = value.logo.contentType;
    // this.selectedLogo.image = value.logo.image;
    // this.selectedLogo.url = value.logo.url;
    // this.selectedLogo.contentType = value.logo.contentType;
    // this.selectedBanner = new ImageClass();
    // this.selectedBanner.contentType = value.banner.contentType;
    // this.selectedBanner.image = value.banner.image;
    // this.selectedBanner.url = value.banner.url;
    this.details = this.setDetails(value.details);
    this.initializaValidatingForm();
    this.territoryService
      .getTerritoryUsingGET(
        localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY)
      )
      .subscribe((result) => {
        this.territorySelected = result;
        this.setValuesValidatingForm();
      });
  }

  constructor(
    private territoryService: TerritoryControllerService,
    private confirmCancel: MatDialog,
    private translate: TranslateService,
    private campaignService: CampaignControllerService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CampaignAddFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _snackBar: MatSnackBar
  ) {}

  onNoClick(event: any, campaign?: CampaignClass): void {
    this.dialogRef.close(campaign);
  }

  ngOnInit(): void {
    this.initializaValidatingForm();
    this.languageDefault = this.translate.currentLang;
    this.campaignCreated = new CampaignClass();
    this.campaignCreated.validationData = new ValidationData();
    const keysWebHook = Object.keys(CampaignWebhook.EventsEnum);
    keysWebHook.forEach((item) => {
      this.weebHooksEventsList.push(CampaignWebhook.EventsEnum[item]);
    });
    this.territoryService
      .getTerritoryUsingGET(
        localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY)
      )
      .subscribe((result) => {
        this.territorySelected = result;
        this.setValuesValidatingForm();
        this.means = this.territorySelected.territoryData.means;
        if (this.type === "add") {
          this.selectedLimits = new SelectedLimits();
          for (let mean of this.means) {
            this.selectedLimits[mean] = new LimitsClass();
          }
        }
      });
    this.initDetailsType();
  }

  setValuesValidatingForm(){
    if (this.type === "add") {
      this.validatingForm.patchValue({
        territoryId: localStorage.getItem(TERRITORY_ID_LOCAL_STORAGE_KEY),
        active: false,
      });
      this.expandableDescription = false;
    } else {
      this.validatingForm.patchValue({
        means: this.campaignUpdated.validationData.means,
        active: this.campaignUpdated.active,
        visible: this.campaignUpdated.visible,
        dateFrom: this.createDate(
          !this.campaignUpdated.dateFrom
            ? START_YEAR_FIXED
            : this.campaignUpdated.dateFrom
        ), //moment(this.campaignUpdated.dateFrom), //moment(this.campaignUpdated.dateFrom, "YYYY-MM-DD"),
        dateTo: this.createDate(
          !this.campaignUpdated.dateTo
            ? END_YEAR_FIXED
            : this.campaignUpdated.dateTo
        ), //moment(this.campaignUpdated.dateTo), //moment(this.campaignUpdated.dateTo, "YYYY-MM-DD"),
        type: this.campaignUpdated.type,
        gameId: !!this.campaignUpdated.gameId ? this.campaignUpdated.gameId : "" ,
        startDayOfWeek: this.campaignUpdated.startDayOfWeek,
        sendWeaklyEmail: this.campaignUpdated.communications,
      });
      this.meansSelected = this.campaignUpdated.validationData.means;
      // console.log(this.campaignUpdated.specificData[CHALLENGE_PLAYER_PROPOSER].split(";")[1])
      if(!!this.campaignUpdated.specificData && this.campaignUpdated.specificData[CHALLENGE_PLAYER_PROPOSER]){
        this.validatingForm.patchValue({
          challengePlayerProposedDay: this.campaignUpdated.specificData[CHALLENGE_PLAYER_PROPOSER].split(";")[1],
          challengePlayerProposedHour: this.campaignUpdated.specificData[CHALLENGE_PLAYER_PROPOSER].split(";")[0],
        });

      }
      if(!!this.campaignUpdated.specificData && this.campaignUpdated.specificData[CHALLENGE_PLAYER_ASSIGNED]){
        this.validatingForm.patchValue({
          challengePlayerAssignedDay: this.campaignUpdated.specificData[CHALLENGE_PLAYER_ASSIGNED].split(";")[1],
          challengePlayerAssignedHour: this.campaignUpdated.specificData[CHALLENGE_PLAYER_ASSIGNED].split(";")[0],
        });
      }
      if (
        !this.campaignUpdated.specificData ||
        Object.keys(this.campaignUpdated.specificData).length <= 0
      ) {
        //do other operation on specificData always before of the means which reset the specificData
        this.campaignUpdated.specificData = {};
        for (let mean of this.meansSelected) {
          this.campaignUpdated.specificData[mean] = new LimitsClass();
          this.campaignUpdated.specificData[mean][DAILY_LIMIT] = null;
          this.campaignUpdated.specificData[mean][WEEKLY_LIMIT] = null;
          this.campaignUpdated.specificData[mean][MONTHLY_LIMIT] = null;
        }
      }
      this.selectedLimits = this.campaignUpdated.specificData;
      this.campaignService
        .getWebhookUsingGET(this.campaignUpdated.campaignId)
        .subscribe((res) => {
          if (!!res) {
            this.validatingForm.patchValue({
              webHookEvents: res.events,
              endPointCongWebHook: res.endpoint,
            });
          }
        });
    }
    // language common for add and update
    this.addFormControlMultilanguage();
    this.languageSelected = this.languageDefault;
    this.validatingForm.patchValue({ languages: this.languageDefault });
    this.chengeSelectedType();
  }

  initializaValidatingForm() {
    if (this.type === "add") {
      this.validatingForm = this.formBuilder.group({
        territoryId: new FormControl("", [Validators.required]),
        languages: new FormControl(""),
        //name: new FormControl("", [Validators.required]),
        logo: new FormControl("", [Validators.required]),
        banner: new FormControl("", [Validators.required]),
        description: new FormControl(""),
        means: new FormControl("", [Validators.required]),
        active: new FormControl("", [Validators.required]),
        visible: new FormControl("", [Validators.required]),
        dateFrom: new FormControl("", [Validators.required]),
        dateTo: new FormControl("", [Validators.required]),
        type: new FormControl("", [Validators.required]),
        sendWeaklyEmail: new FormControl("", [Validators.required]),
        gameId: new FormControl(""),
        startDayOfWeek: new FormControl("", [Validators.pattern("^[1-7]")]),
        webHookEvents: new FormControl(""),
        endPointCongWebHook: new FormControl(""),
        challengePlayerAssignedDay: new FormControl("",),
        challengePlayerAssignedHour: new FormControl("",),
        challengePlayerProposedDay: new FormControl("",),
        challengePlayerProposedHour: new FormControl("",),
      });
    } else {
      this.validatingForm = this.formBuilder.group({
        languages: new FormControl(""),
        description: new FormControl(""),
        means: new FormControl("", [Validators.required]),
        active: new FormControl("", [Validators.required]),
        visible: new FormControl("", [Validators.required]),
        dateFrom: new FormControl("", [Validators.required]),
        dateTo: new FormControl("", [Validators.required]),
        type: new FormControl(""),
        sendWeaklyEmail: new FormControl("", [Validators.required]),
        gameId: new FormControl(""),
        startDayOfWeek: new FormControl(""),
        webHookEvents: new FormControl(""),
        endPointCongWebHook: new FormControl(""),
        challengePlayerAssignedDay: new FormControl("",),
        challengePlayerAssignedHour: new FormControl("",),
        challengePlayerProposedDay: new FormControl("",),
        challengePlayerProposedHour: new FormControl("",),
      });
    }
  }

  public myError = (controlName: string, errorName: string) => {
    return this.validatingForm.controls[controlName].hasError(errorName);
  };

  setSelectedPoint(event: MapPoint): void {
    this.validatingForm.get("lat").setValue(event.latitude);
    this.validatingForm.get("long").setValue(event.longitude);
    //this.unlockRaySelector = true;
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + "km";
    }

    return value;
  }

  chengeSelectedMeans(event: any) {
    if (this.type !== "add") {
      if (
        this.meansSelected.length >
        this.validatingForm.get("means").value.length
      ) {
        // a mean was deleted
        const found = this.findDiffInArray(
          this.validatingForm.get("means").value,
          this.meansSelected
        );
        this.selectedLimits[found] = new LimitsClass();
      } else {
        // a mean was added
        const found = this.findDiffInArray(this.meansSelected, event.value);
        this.meansSelected.push(found);
        this.selectedLimits[found] = new LimitsClass();
      }
    }
    this.meansSelected = this.validatingForm.get("means")
      ? this.validatingForm.get("means").value
      : [];
  }

  chengeSelectedType(){
    if(!!this.validatingForm && this.validatingForm.get('type').value){
      if(this.validatingForm.get('type').value!=='company'){
        this.validatingForm.get('gameId').setValidators([Validators.required]);
        this.validatingForm.get('gameId').updateValueAndValidity();
      }else{
        this.validatingForm.get("gameId").clearValidators();
        this.validatingForm.get('gameId').updateValueAndValidity();
      }
    }
  }

  findDiffInArray(shortArr: any[], longArr: any[]): any {
    var result;
    var found = true;
    for (let i = 0; i < longArr.length; i++) {
      var checkThisValue = false;
      for (let j = 0; j < shortArr.length; j++) {
        if (shortArr[j] === longArr[i]) {
          checkThisValue = true;
        }
      }
      if (!checkThisValue) {
        //if not found in short array it's the result
        result = longArr[i];
        break;
      }
    }
    return result;
  }

  // addPeriods():void{
  //   this.campaignCreated.specificData.periods = {start: 1665871200000, end: 1697407200000};
  // }

  validate(): void {
    this.errorMsgValidation = "";
    if (this.validatingForm.valid) {
      const resValDetails = this.checkValidityDetails();
      if (!resValDetails["bool"]) {
        this.errorMsgValidation = resValDetails["name"];
        return;
      } else {
        this.addMultilanguageFields();
      }
      this.fillCampaingCreated();
      // this.addPeriods(); //TODO remove later
      if (
        !this.validDates(
          this.campaignCreated.dateFrom,
          this.campaignCreated.dateTo
        )
      ) {
        this.errorMsgValidation = "dateNotValid";
        return;
      }
      if((this.campaignCreated.type === "city" || this.campaignCreated.type === "school") && !this.assignedProposedValid()){
        this.errorMsgValidation = "assignedProposedNotValid";
        return;
      }
      if (this.campaignCreated.dateFrom === START_YEAR_FIXED) {
        this.campaignCreated.dateFrom = null;
      }
      if (this.campaignCreated.dateTo === END_YEAR_FIXED) {
        this.campaignCreated.dateTo = null;
      }
      if (this.type === "add") {
        this.campaignCreated.territoryId =
          this.validatingForm.get("territoryId").value;
        this.campaignService
          .addCampaignUsingPOST(this.campaignCreated)
          .subscribe(
            (campaignSubmitted) => {
              this.campaignCreated.campaignId = campaignSubmitted.campaignId;
              if (
                this.uploadImageForModifyBanner &&
                this.uploadImageForModifyLogo
              ) {
                //upload logo and banner
                this.uploadBannerAndLogoPost(this.campaignCreated.campaignId);
              } else if (this.uploadImageForModifyLogo) {
                //upload just logo
                this.uploadLogoPost(this.campaignCreated.campaignId);
              } else if (this.uploadImageForModifyBanner) {
                //upload just banner
                this.uploadBannerPost(this.campaignCreated.campaignId);
              } else {
                // no upload for logo and banner
                this.onNoClick("", this.campaignCreated);
                this._snackBar.openFromComponent(SnackbarSavedComponent, {
                  data: { displayText: "savedData" },
                  duration: 4999,
                });
              }
              if (this.validatingForm.get("webHookEvents").value!== "" && this.validatingForm.get("webHookEvents").value.length >0) {
                let campaignWeebH: CampaignWebhook = {
                  campaignId: this.campaignCreated.campaignId,
                  endpoint: this.validatingForm.get("endPointCongWebHook")
                    ? this.validatingForm.get("endPointCongWebHook").value
                    : "",
                  events: this.validatingForm.get("webHookEvents")
                    ? this.validatingForm.get("webHookEvents").value
                    : [],
                };
                const weebHookConf = {
                  campaignId: this.campaignCreated.campaignId,
                  body: campaignWeebH,
                };
                this.campaignService
                  .setWebhookUsingPOST(weebHookConf)
                  .subscribe(
                    () => {},
                    (error) => {
                      this.translate.instant("dataNotSavedForError") +
                        error.error.ex;
                    }
                  );
              }
            },
            (error) => {
              this.errorMsgValidation =
                this.translate.instant("dataNotSavedForError") + error.error.ex;
            }
          );
      } else if (this.type === "modify") {
        this.campaignCreated.name = this.campaignUpdated.name;
        this.campaignCreated.territoryId = this.campaignUpdated.territoryId;
        this.campaignCreated.campaignId = this.campaignUpdated.campaignId;
        this.campaignService
          .updateCampaignUsingPUT(this.campaignCreated)
          .subscribe(
            () => {
              if (
                this.uploadImageForModifyBanner &&
                this.uploadImageForModifyLogo
              ) {
                //upload logo and banner
                this.uploadBannerAndLogoPost(this.campaignCreated.campaignId);
              } else if (this.uploadImageForModifyLogo) {
                //upload just logo
                this.uploadLogoPost(this.campaignCreated.campaignId);
              } else if (this.uploadImageForModifyBanner) {
                //upload just banner
                this.uploadBannerPost(this.campaignCreated.campaignId);
              } else {
                // no upload for logo and banner
                this.onNoClick("", this.campaignCreated);
                this._snackBar.openFromComponent(SnackbarSavedComponent, {
                  data: { displayText: "savedData" },
                  duration: 4999,
                });
              }
              if (this.validatingForm.get("webHookEvents").value!== "" && this.validatingForm.get("webHookEvents").value.length >0) {
                let campaignWeebH: CampaignWebhook = {
                  campaignId: this.campaignCreated.campaignId,
                  endpoint: this.validatingForm.get("endPointCongWebHook")
                    ? this.validatingForm.get("endPointCongWebHook").value
                    : "",
                  events: this.validatingForm.get("webHookEvents")
                    ? this.validatingForm.get("webHookEvents").value
                    : "",
                };
                const weebHookConf = {
                  campaignId: this.campaignCreated.campaignId,
                  body: campaignWeebH,
                };
                this.campaignService
                  .setWebhookUsingPOST(weebHookConf)
                  .subscribe(
                    () => {},
                    (error) => {
                      this.translate.instant("dataNotSavedForError") +
                        error.error.ex;
                    }
                  );
              }
            },
            (error) => {
              this.errorMsgValidation =
                this.translate.instant("dataNotSavedForError") +
                ": " +
                (error.error.ex
                  ? error.error.ex
                  : this.translate.instant("errorNotProvidedByresponse"));
            }
          );
      }
    } else {
      const nameName = "name" + LANGUAGE_DEFAULT;
      if (
        !!!this.validatingForm.get(nameName) &&
        !!!this.validatingForm.get(nameName).value
      ) {
        this.errorMsgValidation =
          this.translate.instant("nameCampaingForLanguageDefaultNotValid") +
          LANGUAGE_DEFAULT;
      } else {
        this.errorMsgValidation = this.translate.instant("fillAllfields");
      }
    }
  }

  uploadBannerPost(campaignId: string) {
    const formData = new FormData();
    formData.append("data", this.blobImageUploadBanner);
    this.campaignService
      .uploadCampaignBannerUsingPOST({
        campaignId: campaignId,
        body: formData,
      })
      .subscribe(
        () => {
          this.onNoClick("", this.campaignCreated);
          this._snackBar.openFromComponent(SnackbarSavedComponent, {
            data: { displayText: "savedData" },
            duration: 4999,
          });
        },
        (error) => {
          this.errorMsgValidation =
            this.translate.instant("allDataModifiedExceptBanner") +
            (error.error.ex
              ? error.error.ex
              : this.translate.instant("errorNotProvidedByresponse"));
        }
      );
  }

  uploadLogoPost(campaignId: string) {
    const formData = new FormData();
    formData.append("data", this.blobImageUploadLogo); //this.blobImageUploadLogo
    this.campaignService
      .uploadCampaignLogoUsingPOST({
        campaignId: campaignId,
        body: formData,
      })
      .subscribe(
        () => {
          this.onNoClick("", this.campaignCreated);
          this._snackBar.openFromComponent(SnackbarSavedComponent, {
            data: { displayText: "savedData" },
            duration: 4999,
          });
        },
        (error) => {
          this.errorMsgValidation =
            this.translate.instant("allDataModifiedExceptLogo") +
            (error.error.ex
              ? error.error.ex
              : this.translate.instant("errorNotProvidedByresponse"));
        }
      );
  }

  uploadBannerAndLogoPost(campaignId: string) {
    const formData = new FormData();
    formData.append("data", this.blobImageUploadBanner);
    this.campaignService
      .uploadCampaignBannerUsingPOST({
        campaignId: campaignId,
        body: formData,
      })
      .subscribe(
        () => {
          this.uploadLogoPost(campaignId);
        },
        (error) => {
          this.errorMsgValidation =
            this.translate.instant("allDataModifiedExceptBannerAndLogo") +
            (error.error.ex
              ? error.error.ex
              : this.translate.instant("errorNotProvidedByresponse"));
        }
      );
  }

  fillCampaingCreated() {
    this.campaignCreated.active = this.validatingForm.get("active").value;
    //const dataFrom: Moment = this.validatingForm.get("dateFrom").value;
    this.campaignCreated.dateFrom = this.fromDateTimeToLong(
      this.validatingForm.get("dateFrom").value
    ); //dataFrom.toDate();// this.formatDate(dataFrom); //
    //const dataTo: Moment = this.validatingForm.get("dateTo").value;
    this.campaignCreated.dateTo = this.fromDateTimeToLong(
      this.validatingForm.get("dateTo").value
    ); //dataTo.toDate();//this.formatDate(dataTo); //
    this.campaignCreated.logo = new ImageClass();
    if (!!this.selectedLogo) {
      this.campaignCreated.logo.contentType = this.selectedLogo.contentType;
      this.campaignCreated.logo.image = this.selectedLogo.image;
      this.campaignCreated.logo.url = this.selectedLogo.url;
    }
    this.campaignCreated.banner = new ImageClass();
    if (!!this.selectedBanner) {
      this.campaignCreated.banner.contentType = this.selectedBanner.contentType;
      this.campaignCreated.banner.image = this.selectedBanner.image;
      this.campaignCreated.banner.url = this.selectedBanner.url;
    }
    this.campaignCreated.type = this.validatingForm.get("type").value;
    this.campaignCreated.visible = this.validatingForm.get("visible").value;
    this.campaignCreated.validationData.means =
      this.validatingForm.get("means").value;
    if (this.validatingForm.get("type").value !== "company") {
      if (!!this.validatingForm.get("gameId").value) {
        this.campaignCreated.gameId = this.validatingForm.get("gameId").value;
      }
      if (!!this.validatingForm.get("startDayOfWeek").value) {
        this.campaignCreated.startDayOfWeek =
          this.validatingForm.get("startDayOfWeek").value;
      } else {
        this.campaignCreated.startDayOfWeek = 1; //default value
      }
    }
    this.campaignCreated.communications =
      this.validatingForm.get("sendWeaklyEmail").value;
    this.campaignCreated.specificData = {};
    if (this.type === "modify") {
      const specificDataKeys = Object.keys(this.campaignUpdated.specificData);
      for (let key of specificDataKeys) {
        // mantains all the other keys present in specificData, like survey and periods
        this.campaignCreated.specificData[key] =
          this.campaignUpdated.specificData[key];
        const meansUsed: string[] = this.validatingForm.get("means").value;
        if (this.means.find((item) => item === key)) {
          //reset means that are restored with the next for loop, enter here when a delete of a mean is made
          delete this.campaignCreated.specificData[key];
        }
      }
    }
    for (let mean of this.validatingForm.get("means").value) {
      this.campaignCreated.specificData[mean] = new LimitsClass();
      this.campaignCreated.specificData[mean][DAILY_LIMIT] =
        this.selectedLimits[mean][DAILY_LIMIT];
      this.campaignCreated.specificData[mean][WEEKLY_LIMIT] =
        this.selectedLimits[mean][WEEKLY_LIMIT];
      this.campaignCreated.specificData[mean][MONTHLY_LIMIT] =
        this.selectedLimits[mean][MONTHLY_LIMIT];
    }
    if(this.campaignCreated.type === "city" || this.campaignCreated.type === "school"){
      if(this.validatingForm.get("challengePlayerProposedHour").value!==null && this.validatingForm.get("challengePlayerProposedDay").value!==null){
        this.campaignCreated.specificData[CHALLENGE_PLAYER_PROPOSER] = this.validatingForm.get("challengePlayerProposedHour").value + ";"+ this.validatingForm.get("challengePlayerProposedDay").value;
      }else{
        this.campaignCreated.specificData[CHALLENGE_PLAYER_PROPOSER] = null;
      }
      if(this.validatingForm.get("challengePlayerAssignedHour").value!==null && this.validatingForm.get("challengePlayerAssignedDay").value!==null){
        this.campaignCreated.specificData[CHALLENGE_PLAYER_ASSIGNED] = this.validatingForm.get("challengePlayerAssignedHour").value + ";"+ this.validatingForm.get("challengePlayerAssignedDay").value;
      }else{
        this.campaignCreated.specificData[CHALLENGE_PLAYER_ASSIGNED] = null;
      }
    }

    console.log("after: ", this.campaignCreated.specificData);
  }

  uploadLogo(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      const eev = event;
      this.blobImageUploadLogo = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.selectedLogo = new ImageClass();
        this.selectedLogo.contentType = eev.target.files[0].type;
        const prefix =
          this.PREFIX_SRC_IMG_C +
          this.selectedLogo.contentType +
          this.BASE64_SRC_IMG_C;
        const base64string = event.target.result.slice(prefix.length);
        if (typeof base64string === "string") {
          this.selectedLogo.image = base64string;
        }
        this.uploadImageForModifyLogo = true;
      };
    }
  }

  uploadBanner(event: any): void {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      const eev = event;
      this.blobImageUploadBanner = event.target.files[0];
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event) => {
        this.selectedBanner = new ImageClass();
        this.selectedBanner.contentType = eev.target.files[0].type;
        const prefix =
          this.PREFIX_SRC_IMG_C +
          this.selectedBanner.contentType +
          this.BASE64_SRC_IMG_C;
        const base64string = event.target.result.slice(prefix.length);
        if (typeof base64string === "string") {
          this.selectedBanner.image = base64string;
        }
        this.uploadImageForModifyBanner = true;
      };
    }
  }

  formatDate(datee: Moment): string {
    var day = (+datee.toObject().date.toString()).toString();
    if (day.length === 1) {
      day = "0" + day;
    }
    var month = (+datee.toObject().months.toString() + 1).toString();
    if (month.length === 1) {
      month = "0" + month;
    }
    const year = datee.toObject().years.toString();
    return year + "-" + month + "-" + day;
  }

  fromDateTimeToLong(dateString: string): number {
    //yyyy-mm-ddThh:mm:ss format date
    if (dateString.length === "yyyy-mm-ddThh:mm:ss".length) {
      const newDate = DateTime.fromFormat(dateString, "yyyy-MM-dd'T'HH:mm:ss", {
        zone: this.territorySelected.timezone,
      });
      return newDate.toMillis();
    } else {
      const newDate = DateTime.fromFormat(dateString, "yyyy-MM-dd'T'HH:mm", {
        zone: this.territorySelected.timezone,
      });
      return newDate.toMillis();
    }
  }

  createDate(timestamp: number): string {
    const date = DateTime.fromMillis(timestamp, {
      zone: this.territorySelected.timezone,
    });
    return date.toFormat("yyyy-MM-dd'T'HH:mm:ss");
  }

  get descriptionRichControl() {
    const name = "description" + this.languageSelected;
    // var obj = {};
    // obj[name] = this.campaignUpdated.description[this.languageSelected] ?  this.campaignUpdated.description[this.languageSelected] : '';
    // this.validatingForm.patchValue(obj);
    return this.validatingForm.controls[name] as FormControl;
  }

  get privacyRichControl() {
    return this.validatingForm.controls.privacy as FormControl;
  }

  get rulesRichControl() {
    return this.validatingForm.controls.rules as FormControl;
  }

  toggleDescription() {
    this.stateDescription =
      this.stateDescription === "collapsed" ? "expanded" : "collapsed";
  }

  addMultilanguageFields() {
    this.campaignCreated.name = {};
    this.campaignCreated.description = {};
    this.campaignCreated.details = {};
    for (let l of CONST_LANGUAGES_SUPPORTED) {
      //name
      const nameName = "name" + l;
      this.campaignCreated.name[l] = this.validatingForm.get(nameName).value;
      //description
      const nameDescription = "description" + l;
      this.campaignCreated.description[l] = this.validatingForm.get(
        nameDescription
      ).value
        ? this.validatingForm.get(nameDescription).value
        : undefined;
      //details
      this.campaignCreated.details[l] = [];
      if (this.details) {
        this.details.forEach((item) => {
          var detail = new CampaignDetailClass();
          detail.content = item.languageDataForm[l].get("content")
            ? item.languageDataForm[l].get("content").value
            : "";
          detail.name = item.languageDataForm[l].get("name")
            ? item.languageDataForm[l].get("name").value
            : null;
          detail.extUrl = item.staticTypeForm.get("extUrl")
            ? item.staticTypeForm.get("extUrl").value
            : null;
          detail.type = item.staticTypeForm.get("type")
            ? item.staticTypeForm.get("type").value
            : null;
          this.campaignCreated.details[l].push(detail);
        });
      }
    }
  }

  checkValidityDetails(): {} {
    var result = { bool: true, name: "" };
    this.details.forEach((item) => {
      if (item.staticTypeForm.valid) {
        for (let l of this.languagesSupported) {
          if (!item.languageDataForm[l].valid) {
            result = {
              bool: false,
              name:
                this.translate.instant("nameNotDefined") +
                ", " +
                this.translate.instant("onLanguage") +
                ": " +
                l,
            };
          }
        }
      } else {
        result = { bool: false, name: this.translate.instant("typeNotSetted") };
      }
    });
    return result;
  }

  validDatesOld(startt: string, endd: string): boolean {
    this.errorMsgValidation = "";
    const dateStart = startt + "";
    const dateEnd = endd + "";
    const start = dateStart.split("-");
    const startDay = +start[2];
    const startMonth = +start[1];
    const startYear = +start[0];
    const end = dateEnd.split("-");
    const endDay = +end[2];
    const endMonth = +end[1];
    const endYear = +end[0];
    if (startYear > endYear) {
      return false;
    } else if (startYear < endYear) {
      return true;
    } else {
      //startYear===endYear
      if (startMonth > endMonth) {
        return false;
      } else if (startMonth < endMonth) {
        return true;
      } else {
        // startMonth===endMonth
        if (startDay >= endDay) {
          return false;
        } else {
          return true;
        }
      }
    }
  }

  validDates(start: number, end: number) {
    if (start < end) {
      return true;
    }
    return false;
  }

  assignedProposedValid(): boolean{
    // console.log('ppppp: ',this.validatingForm.get("challengePlayerProposedHour").value, this.validatingForm.get("challengePlayerAssignedHour").value, this.validatingForm.get("challengePlayerProposedDay").value, this.validatingForm.get("challengePlayerAssignedDay").value)
    if (!this.validatingForm.get("challengePlayerProposedHour").value && !this.validatingForm.get("challengePlayerAssignedHour").value && !this.validatingForm.get("challengePlayerProposedDay").value && !this.validatingForm.get("challengePlayerAssignedDay").value){
      //all values empty
      return true;
    }
    try{
      const hour_prop = parseInt(this.validatingForm.get("challengePlayerProposedHour").value);
      const day_prop = this.day_week_const.find(item=>item['day'] ===this.validatingForm.get("challengePlayerProposedDay").value)["value"];
      const hour_assign = parseInt(this.validatingForm.get("challengePlayerAssignedHour").value);
      const day_assign = this.day_week_const.find(item=>item['day'] ===this.validatingForm.get("challengePlayerAssignedDay").value)["value"];
      if(day_assign>day_prop){
        return true;
      }else if(day_assign<day_prop){
        return false;
      }else{
        if(hour_assign>hour_prop){
          return true;
        }else{
          return false;
        }
      }
    }catch{
      //if here at least one value null
      // console.log('Inside catch');
      return false;
    }

  }

  cancelGoBack(event: any) {
    if (this.hasBeenModified()) {
      const dialogRef = this.confirmCancel.open(ConfirmCancelComponent, {
        width: "40%",
        //height: "150px",
      });
      let instance = dialogRef.componentInstance;

      dialogRef.afterClosed().subscribe((result) => {
        if (result !== undefined) {
          if (result) {
            this.onNoClick("", undefined);
          }
        }
      });
    } else {
      this.onNoClick("", undefined);
    }
  }

  hasBeenModified(): boolean {
    return this.validatingForm.touched;
  }

  setDetails(details: {
    [key: string]: CampaignDetail[];
  }): DetailsForAddModifyModule[] {
    var result = [];
    if (!!details && details[LANGUAGE_DEFAULT]) {
      var totalNumberOfDetail = details[LANGUAGE_DEFAULT].length;
      var keys = Object.keys(details); // subset of CONST_LANGUAGES_SUPPORTED
      for (let i = 0; i < totalNumberOfDetail; i++) {
        //iterate over the campaignDetails supposed that the default language is the one that has all the campaigns
        let item = new DetailsForAddModifyModule();
        item.collapsed = true;
        item.created = false;
        item.languageDataForm = {};
        item.staticTypeForm = this.formBuilder.group({
          extUrl: new FormControl(""),
          type: new FormControl("", [Validators.required]),
        });
        item.staticTypeForm.patchValue({
          extUrl: details[LANGUAGE_DEFAULT][i].extUrl,
          type: details[LANGUAGE_DEFAULT][i].type,
        });
        for (let l of CONST_LANGUAGES_SUPPORTED) {
          item.languageDataForm[l] = this.formBuilder.group({
            name: new FormControl("", [
              Validators.required,
              Validators.maxLength(40),
            ]),
            content: new FormControl(""),
          });
          if (details[l]) {
            //json object with the language exists
            if (details[l][i]) {
              //campaingDetail-iesimo exists
              item.languageDataForm[l].patchValue({
                name: details[l][i].name
                  ? details[l][i].name
                  : details[LANGUAGE_DEFAULT][i].name,
                content: details[l][i].content ? details[l][i].content : "",
              });
            } else {
              //campaingDetail-iesimo doesn't exists (copy data from default)
              //should enter here if data on 'it':[1,2,3] while 'en':[1,2] so there are some campaigndetails missing on the others languages
              item.languageDataForm[l].patchValue({
                name: details[LANGUAGE_DEFAULT][i].name,
                content: "",
              });
            }
          } else {
            //json object with language doesn't exists
            // for example {'it':[details1,details2]} doesn't have 'en' add a full-empty form copying the default values
            item.languageDataForm[l].patchValue({
              name: details[LANGUAGE_DEFAULT][i].name,
              content: "",
            });
          }
        }
        result.push(item);
      }
    }
    return result;
  }

  addDetail() {
    var item = new DetailsForAddModifyModule();
    item.collapsed = false;
    item.created = true;
    item.languageDataForm = {};
    item.staticTypeForm = this.formBuilder.group({
      extUrl: new FormControl(""),
      type: new FormControl("", [Validators.required]),
    });
    for (let l of this.languagesSupported) {
      item.languageDataForm[l] = this.formBuilder.group({
        name: new FormControl("", [
          Validators.required,
          Validators.maxLength(40),
        ]),
        content: new FormControl(""),
      });
    }
    this.details.push(item);
  }

  deleteDetail(removeEl: DetailsForAddModifyModule) {
    this.details = this.details.filter((item) => item != removeEl);
  }

  toggleDetail(detail: DetailsForAddModifyModule) {
    this.details.forEach((item, index) => {
      if (item === detail) {
        this.details[index].collapsed = !this.details[index].collapsed;
      }
    });
  }

  initDetailsType() {
    this.detailsType = [];
    for (var enumMember in CampaignDetail.TypeEnum) {
      this.detailsType.push({
        value: CampaignDetail.TypeEnum[enumMember],
        used: false,
      });
    }
  }

  addFormControlMultilanguage() {
    for (let l of this.languagesSupported) {
      const nameName = "name" + l;
      const nameDescription = "description" + l;
      let controlName;
      let controlDescription = new FormControl("");
      if (l === LANGUAGE_DEFAULT) {
        controlName = new FormControl("", [
          Validators.required,
          Validators.maxLength(40),
        ]);
      } else {
        controlName = new FormControl("", [Validators.maxLength(40)]);
      }
      this.validatingForm.addControl(nameName, controlName);
      this.validatingForm.addControl(nameDescription, controlDescription);
      if (this.type !== "add") {
        var obj = {};
        obj[nameName] = this.campaignUpdated.name[l];
        obj[nameDescription] = this.campaignUpdated.description[l]
          ? this.campaignUpdated.description[l]
          : "";
        this.validatingForm.patchValue(obj);
      }
    }
  }

  selectedLanguageClick(event: any) {
    this.languageSelected = event;
  }

  transformActiveBoolean(val: boolean): string {
    if (val) {
      return "active";
    } else {
      return "inactive";
    }
  }

  transformActiveBooleanMale(val: boolean): string {
    if (val) {
      return "activeMale";
    } else {
      return "inactiveMale";
    }
  }

  transformActiveBooleanVisible(val: boolean): string {
    if (val) {
      return "visible";
    } else {
      return "notVisible";
    }
  }
}

export class SelectedLimits {
  walk?: LimitsClass;
  bike?: LimitsClass;
  bus?: LimitsClass;
  car?: LimitsClass;
  train?: LimitsClass;
  boat?: LimitsClass;
}

export class LimitsClass {
  dailyLimit?: number;
  weeklyLimit?: number;
  monthlyLimit?: number;
}
