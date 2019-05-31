// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  emailAPI: 'http://XXXXXX.com/contact-form.php',
  database: 'firebase',
  social: {
    role: 'Guest',
    fblink: 'https://www.facebook.com/goverdhan.koyalkar',
    linkedin: 'https://www.facebook.com/goverdhan.koyalkar',
    github: 'https://github.com/goverdhan1',
    emailid: 'goverdhan.k@gmail.com'
  },
  socialAuthEnabled: true,
  firebase : {
    apiKey: "AIzaSyAskej54dxzlunxBN1emZrKe1Gc54ZBWhA",
    authDomain: "https://vishwabharathihighschool-74e9c.firebaseio.com",
    databaseURL: "https://vishwabharathihighschool-74e9c.firebaseio.com",
    projectId: "vishwabharathihighschool-74e9c",
    storageBucket: "",
    messagingSenderId: ""
  }
}
/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
