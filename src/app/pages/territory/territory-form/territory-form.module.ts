import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { SharedModule } from "src/app/shared/shared.module";
import { TerritoryFormComponent } from "./territory-form.component";
import { MatButtonModule } from "@angular/material/button";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  imports: [
    SharedModule,
    MatGridListModule,
    MatFormFieldModule,
    MatButtonModule,
    MatInputModule,
  ],
  declarations: [TerritoryFormComponent],
})
export class TerritoryFormModule {}
