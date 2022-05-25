import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { DropDownCardInfoComponent } from "./drop-down-card-info.component";

@NgModule({
  imports: [
      CommonModule,
      MatButtonModule,
      MatCardModule,
      MatIconModule
  ],
  declarations: [DropDownCardInfoComponent],
  exports: [DropDownCardInfoComponent]
})
export class DropDownCardInfoModule {}
