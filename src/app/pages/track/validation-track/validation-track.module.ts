
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DistanceDialogComponent } from '../distance-dialog/distance-dialog.component';
import { StatusDialogComponent } from '../status-dialog/status-dialog.component';
import { ValidationTrackComponent } from './validation-track.component';
import { ValidationTrackPageRouting } from './validation-track.routing';

@NgModule({
    imports: [
      SharedModule,
      ValidationTrackPageRouting,
    ],
    declarations: [ValidationTrackComponent,DistanceDialogComponent,StatusDialogComponent],
  })
  export class TerritoryPageModule {}