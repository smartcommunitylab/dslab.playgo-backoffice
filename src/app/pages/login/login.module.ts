import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing';
import { MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';
import { MatInputModule} from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [SharedModule, LoginRoutingModule,MatFormFieldModule,MatIconModule,MatGridListModule,MatButtonModule,MatInputModule,
    MatCheckboxModule ],
  declarations: [LoginComponent],
})
export class LoginModule {}
