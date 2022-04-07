import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule} from '@angular/common/http';
import { CommonModule } from '@angular/common';

@NgModule({
  imports:[
    TranslateModule,CommonModule
  ],
  exports: [
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule
  ]
})
export class SharedLibsModule {}
