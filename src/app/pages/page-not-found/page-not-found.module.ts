import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PageNotFoundComponent } from './page-not-found.component';
import { PageNotFoundRoutingModule } from './page-not-found.routing';

@NgModule({
  imports: [SharedModule,PageNotFoundRoutingModule ],
  declarations: [PageNotFoundComponent],
})
export class PageNotFoundModule {}
