import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CampaignAddFormComponent } from "../campaign-add-form/campaign-add-form.component";
import { CampaignDeleteComponent } from "../campaign-delete/campaign-delete.component";
import { ManagerHandlerComponent } from "../manager-handler/manager-handler.component";
import { ManagerDeleteComponent } from "../manager-handler/manager-delete/manager-delete.component";
import { CampaignPageComponent } from "./campaign-page.component";
import { CampaignPageRouting } from "./capaign-page.routing";

@NgModule({
  imports: [
    SharedModule,
    CampaignPageRouting,
  ],
  declarations: [CampaignPageComponent,CampaignAddFormComponent,CampaignDeleteComponent,ManagerHandlerComponent,ManagerDeleteComponent],
})
export class CampaignPageModule {}
