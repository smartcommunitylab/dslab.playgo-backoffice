import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@NgModule({
  imports: [SharedModule, LoginRoutingModule,MatFormFieldModule,MatIconModule,MatGridListModule ],
  declarations: [LoginComponent],
})
export class LoginModule {}
