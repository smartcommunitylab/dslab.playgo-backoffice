import { NgModule } from '@angular/core';
import { SharedLibsModule } from './shared-libs.module';

@NgModule({
  imports: [SharedLibsModule],
  declarations: [
  ],
  entryComponents: [],
  exports: [
    SharedLibsModule
  ]
})
export class SharedModule {}
