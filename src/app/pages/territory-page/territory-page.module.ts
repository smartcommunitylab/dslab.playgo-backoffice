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
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from "@angular/material/paginator";

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
  ],
  declarations: [TerritoryPageComponent],
})
export class TerritoryPageModule {}
