import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TerritoryFormComponent } from './territory-form.component';

const routes: Routes = [
  {
    path: '',
    component: TerritoryFormComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TerritoryFormRoutingModule {}
