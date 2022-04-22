import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LoadingService } from "./shared/services/loading.service";
import { delay } from "rxjs/operators";

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit{
  title = "backOfficeConsolePlayGo";
  events: string[] = [];
  opened: boolean;
  loading: boolean = false;

  tiles: Tile[] = [
    { text: "One", cols: 3, rows: 1, color: "lightblue" },
    { text: "Two", cols: 1, rows: 2, color: "lightgreen" },
    { text: "Three", cols: 1, rows: 1, color: "lightpink" },
    { text: "Four", cols: 2, rows: 1, color: "#DDBDF1" },
  ];
  login: boolean = false;

  constructor(
    private translate: TranslateService,
    private _loading: LoadingService
  ) {
    this.translate.setDefaultLang("it");
  }

  ngOnInit() {
    this.listenToLoading();
  }

  listenToLoading(): void {
    this._loading.loadingSub
      .pipe(delay(0)) // This prevents a ExpressionChangedAfterItHasBeenCheckedError for subsequent requests
      .subscribe((loading) => {
        this.loading = loading;
      });
  }
}
