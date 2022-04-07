import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home.routing';

@NgModule({
  imports: [SharedModule, HomeRoutingModule ],
  declarations: [HomeComponent],
})
export class HomeModule {}
