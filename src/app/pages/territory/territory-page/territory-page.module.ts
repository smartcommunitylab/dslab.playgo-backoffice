import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { TerritoryPageComponent } from "./territory-page.component";
import { TerritoryPageRouting } from "./territory-page.routing";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDialogModule } from "@angular/material/dialog";
import { TerritoryAddFormComponent } from "../territory-add-form/territory-add-form.component";
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { MapComponent } from "src/app/shared/components/map-with-selector/map.component";
import { MatSliderModule } from '@angular/material/slider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { TerritoryDeleteComponent } from "../territory-delete/territory-delete.component";

@NgModule({
  imports: [
    SharedModule,
    TerritoryPageRouting,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatGridListModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatSnackBarModule,
    LeafletModule,
    MatSliderModule,
    ReactiveFormsModule
  ],
  declarations: [TerritoryPageComponent,TerritoryAddFormComponent,TerritoryDeleteComponent,MapComponent],
})
export class TerritoryPageModule {}
