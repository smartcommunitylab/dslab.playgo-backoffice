import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerritoryPageComponent } from './territory-page.component';

const routes: Routes = [
  {
    path: '',
    component: TerritoryPageComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerritoryPageRouting {}
