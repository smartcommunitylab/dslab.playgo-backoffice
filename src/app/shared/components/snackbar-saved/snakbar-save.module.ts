import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatIconModule } from "@angular/material/icon";
import { SharedLibsModule } from "../../shared-libs.module";
import { SnackbarSavedComponent } from "./snackbar-saved.component";

@NgModule({
  imports: [
    SharedLibsModule,
    CommonModule,
    MatIconModule,
    MatGridListModule,
    MatButtonModule,
  ],
  declarations: [SnackbarSavedComponent],
  exports: [SnackbarSavedComponent]
})
export class SnackbarSavedModule {}
