import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';
import { TerritoryFormComponent } from '../territory/territory-form/territory-form.component';

@NgModule({
  imports: [SharedModule, HomeRoutingModule ],
  declarations: [HomeComponent, TerritoryFormComponent],
})
export class HomeModule {}
