import { NgModule } from "@angular/core";
import { SharedModule } from "src/app/shared/shared.module";
import { TerritoryPageComponent } from "./territory-page.component";
import { TerritoryPageRouting } from "./territory-page.routing";
import { TerritoryAddFormComponent } from "../territory-add-form/territory-add-form.component";
import { TerritoryDeleteComponent } from "../territory-delete/territory-delete.component";
import { MapComponent } from "src/app/shared/components/map-with-selector/map.component";

@NgModule({
  imports: [
    SharedModule,
    TerritoryPageRouting,
  ],
  declarations: [TerritoryPageComponent,TerritoryAddFormComponent,TerritoryDeleteComponent,MapComponent],
})
export class TerritoryPageModule {}
