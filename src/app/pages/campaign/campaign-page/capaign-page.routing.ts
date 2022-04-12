import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CampaignPageComponent } from './campaign-page.component';

const routes: Routes = [
  {
    path: '',
    component: CampaignPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CampaignPageRouting {}
