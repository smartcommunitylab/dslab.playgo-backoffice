
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommunicationComponent } from './communication.component';
import { CommunicationRouting } from './communication.routing';
import { CommunicationAddComponent } from './communication-add/communication-add.component';

@NgModule({
    imports: [
      SharedModule,
      CommunicationRouting
    ],
    declarations: [CommunicationComponent, CommunicationAddComponent],
  })
  export class CommunicationModule {}