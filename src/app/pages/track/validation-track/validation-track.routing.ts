import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ValidationTrackComponent } from './validation-track.component';

const routes: Routes = [
  {
    path: '',
    component: ValidationTrackComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ValidationTrackPageRouting {}