import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HandleUsersComponent } from './handle-users.component';

const routes: Routes = [
  {
    path: '',
    component: HandleUsersComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HandleUsersRouting {}
