import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CampaignAddFormComponent } from "../campaign-add-form/campaign-add-form.component";
import { CampaignDeleteComponent } from "../campaign-delete/campaign-delete.component";
import { ManagerHandlerComponent } from "../manager-handler/manager-handler.component";
import { ManagerDeleteComponent } from "../manager-handler/manager-delete/manager-delete.component";
import { CampaignPageComponent } from "./campaign-page.component";
import { CampaignPageRouting } from "./capaign-page.routing";
import { SurveyComponentComponent } from "../survey-component/survey-component.component";
import { AssignSurvayComponent } from "../survey-component/assign-survay/assign-survay.component";
import { DeleteSurvayComponent } from "../survey-component/delete-survay/delete-survay.component";
import { ConfirmCancelComponent } from "../campaign-add-form/confirm-cancel/confirm-cancel.component";
import { RewardsComponent } from "../rewards/rewards.component";
import { ConfirmCloseComponent } from "../manager-handler/confirm-close/confirm-close.component";


@NgModule({
  imports: [SharedModule, CampaignPageRouting],
  declarations: [
    CampaignPageComponent,
    CampaignAddFormComponent,
    CampaignDeleteComponent,
    ManagerHandlerComponent,
    ManagerDeleteComponent,
    SurveyComponentComponent,
    AssignSurvayComponent,
    DeleteSurvayComponent,
    ConfirmCancelComponent,
    RewardsComponent,
    ConfirmCloseComponent,
  ],
})
export class CampaignPageModule {}
