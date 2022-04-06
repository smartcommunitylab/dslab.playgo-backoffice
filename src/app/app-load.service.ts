import { Injectable } from '@angular/core';
import { AuthService } from './core/auth/auth.service';

@Injectable()
export class AppLoadService {

  constructor( public authService: AuthService) { }

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
      console.log(`initializeApp:: inside promise`);
      this.authService.init().then(() => {
        let isAuthenticated = this.authService.isLoggedIn();
        if (!isAuthenticated) {
          if (!!this.getQueryStringValue('code')) {
            this.authService.completeAuthentication().then(() => {
              if (this.authService.isLoggedIn()) {
                this.initialize().then (()=> {
                  resolve(true);
                });
              }
            });
          } else {
            this.authService.startAuthentication();
          }
        } else {
          this.initialize().then (()=> {
            resolve(true);
          }); 
        }
      });
    });
  }

  initialize() {
    return new Promise((resolve, reject) => {
        //TODO getProfile
        return resolve(true);
      });
  }

  getQueryStringValue(key) {
    return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));
  }

}