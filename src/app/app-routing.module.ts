import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ADMIN, TERRITORY_ADMIN } from './shared/constants/constants';
import { AuthGuardService } from './shared/services/auth-guard.service';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () =>
      import('./pages/home/home.module').then((m) => m.HomeModule),
  },
  // {
  //   path: 'login',
  //   canActivate: [AuthGuardService], 
  //   data: { 
  //     expectedRoles: ['admin']
  //   },
  //   loadChildren: () =>
  //     import('./pages/login/login.module').then((m) => m.LoginModule),
  // },
  {
    path: 'territory',
    canActivate: [AuthGuardService], 
    data: {
      expectedRoles: [ADMIN]
    },
    loadChildren: () =>
      import('./pages/territory/territory-page/territory-page.module').then((m) => m.TerritoryPageModule),
  },
  {
    path: 'campaign',
    canActivate: [AuthGuardService], 
    data: { 
      expectedRoles: [ADMIN,TERRITORY_ADMIN]
    },
    loadChildren: () =>
      import('./pages/campaign/campaign-page/campaign-page.module').then((m) => m.CampaignPageModule),
  },
  {
    path: 'handle-users',
    canActivate: [AuthGuardService], 
    data: { 
      expectedRoles: [ADMIN,TERRITORY_ADMIN]
    },
    loadChildren: () =>
      import('./pages/handle-users/handle-users.module').then((m) => m.HandleUsersModule),
  },
  {
    path: 'track',
    canActivate: [AuthGuardService], 
    data: { 
      expectedRoles: [ADMIN,TERRITORY_ADMIN]
    },
    loadChildren: () =>
      import('./pages/track/validation-track/validation-track.module').then((m) => m.TerritoryPageModule),
  },
  {
    path: 'communication',
    canActivate: [AuthGuardService], 
    data: { 
      expectedRoles: [ADMIN,TERRITORY_ADMIN]
    },
    loadChildren: () =>
      import('./pages/communication/communication.module').then((m) => m.CommunicationModule),
  },
  {
    path: '404',
    loadChildren: () =>
      import('./pages/page-not-found/page-not-found.module').then((m) => m.PageNotFoundModule),
  },
  {
    path:'',
    redirectTo: 'home'
  },
  {
    path:'**',
    redirectTo: '404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
