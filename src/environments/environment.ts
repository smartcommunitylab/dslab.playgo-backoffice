// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  serverAPIURL: 'https://backenddev.playngo.it/playandgo/api',
  auth:{
    aacUrl:'https://aac.platform.smartcommunitylab.it',
    aacClientId:'c_5445634c-95d6-4c0e-a1ff-829b951b91b3',
    redirectUrl:'http://localhost:4200/',
    logout_redirect:'http://localhost:4200/',
    scope:'openid email profile'
  } 
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
