import { NgModule } from "@angular/core";
import { SharedLibsModule } from "./shared-libs.module";
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
import { MatOptionModule } from "@angular/material/core";
import { MatSelectModule } from "@angular/material/select";
import { LeafletModule } from "@asymmetrik/ngx-leaflet";
import { MatSliderModule } from "@angular/material/slider";
import { ReactiveFormsModule } from "@angular/forms";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RichTextEditorModule } from "./components/rich-text-editor/rich-text-editor.module";
import { DropDownCardInfoModule } from "./components/drop-down-card-info/drop-down-card-info.module";
import { MatSortModule } from "@angular/material/sort";
import { ManagerHandlerTerritoryComponent } from "../pages/territory/manager-handler/manager-handler.component";
import { ManagerDeleteTerritoryComponent } from "../pages/territory/manager-handler/manager-delete/manager-delete.component";
import {MatTreeModule} from '@angular/material/tree';
import {MatTooltipModule} from '@angular/material/tooltip';
import { RoundPipe } from "./services/decimal.pipe";
import {MatTabsModule} from '@angular/material/tabs';
import { SnackbarSavedModule } from "./components/snackbar-saved/snakbar-save.module";
import {MatCheckboxModule} from '@angular/material/checkbox';

@NgModule({
  imports: [
    SharedLibsModule,
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
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTreeModule,
    MatTooltipModule,
    RichTextEditorModule,
    DropDownCardInfoModule,
    MatTabsModule,
    SnackbarSavedModule,
    MatCheckboxModule,

  ],
  declarations: [ManagerHandlerTerritoryComponent,ManagerDeleteTerritoryComponent,RoundPipe],
  entryComponents: [],
  exports: [
    SharedLibsModule,
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
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTreeModule,
    MatTooltipModule,
    RichTextEditorModule,
    DropDownCardInfoModule,
    RoundPipe,
    MatTabsModule,
    SnackbarSavedModule,
    MatCheckboxModule
  ],
})
export class SharedModule {}
