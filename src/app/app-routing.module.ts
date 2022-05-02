import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'territory',
    loadChildren: () =>
      import('./pages/territory/territory-page/territory-page.module').then((m) => m.TerritoryPageModule),
  },
  {
    path: 'campaign',
    loadChildren: () =>
      import('./pages/campaign/campaign-page/campaign-page.module').then((m) => m.CampaignPageModule),
  },
  {
    path: 'track',
    loadChildren: () =>
      import('./pages/track/validation-track/validation-track.module').then((m) => m.TerritoryPageModule),
  },
  {
    path:'',
    redirectTo: 'home'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
