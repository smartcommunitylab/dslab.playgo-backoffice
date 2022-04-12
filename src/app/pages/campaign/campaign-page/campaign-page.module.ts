import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { CampaignAddFormComponent } from "../campaign-add-form/campaign-add-form.component";
import { CampaignDeleteComponent } from "../campaign-delete/campaign-delete.component";
import { CampaignPageComponent } from "./campaign-page.component";
import { CampaignPageRouting } from "./capaign-page.routing";

@NgModule({
  imports: [
    SharedModule,
    CampaignPageRouting,
  ],
  declarations: [CampaignPageComponent,CampaignAddFormComponent,CampaignDeleteComponent],
})
export class CampaignPageModule {}
