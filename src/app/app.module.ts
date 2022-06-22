import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { SharedModule } from './shared/shared.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from './core/auth/auth.service';
import { AppLoadService } from './app-load.service';
import { AuthGuard } from './core/auth/auth.guard';
import { AuthInterceptor } from './core/auth/auth.interceptor';
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { SideNavComponent } from './shared/components/side-nav/side-nav';
import { AccountDialogComponent } from './shared/components/account-dialog/account-dialog.component';
import { SpinnerInterceptor } from './core/loader/spinner.interceptor';
import { SurveyComponentComponent } from './pages/campaign/survey-component/survey-component.component';
import { DeleteSurvayComponent } from './pages/campaign/survey-component/delete-survay/delete-survay.component';
import { AssignSurvayComponent } from './pages/campaign/survey-component/assign-survay/assign-survay.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http);
}

export function init_app(appLoadService: AppLoadService) {
  return () => appLoadService.initializeApp();
}

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    AccountDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    MatSidenavModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    }),
    NoopAnimationsModule,
  ],
  providers: [
    AppLoadService,
    { provide: APP_INITIALIZER, useFactory: init_app, deps: [AppLoadService], multi: true },
    AuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule { }
