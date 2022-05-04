
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommunicationComponent } from './communication.component';
import { CommunicationRouting } from './communication.routing';

@NgModule({
    imports: [
      SharedModule,
      CommunicationRouting
    ],
    declarations: [CommunicationComponent],
  })
  export class CommunicationModule {}