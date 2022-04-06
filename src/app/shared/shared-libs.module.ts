import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { HttpClientModule} from '@angular/common/http';

@NgModule({
  imports:[
    TranslateModule
  ],
  exports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    MdbCheckboxModule,
    MatSliderModule,
    HttpClientModule
  ]
})
export class SharedLibsModule {}
