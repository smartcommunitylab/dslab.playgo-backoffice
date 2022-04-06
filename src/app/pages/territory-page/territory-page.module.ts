import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { TerritoryPageComponent } from './territory-page.component';
import { TerritoryPageRouting } from './territory-page.routing';

@NgModule({
  imports: [SharedModule,TerritoryPageRouting],
  declarations: [TerritoryPageComponent],
})
export class TerritoryPageModule {}
