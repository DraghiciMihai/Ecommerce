// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: 'https://localhost:8443/api', 
  stripePublishableKey: 'pk_test_51QNdARHafYwE1wM41HrKs6zJPxywFRcVJoRSG6LpTc6fIznlnFSEmDzquHuQp3nT4eBl5n1NzwzzhF65Q23l2QOJ00O8P6gesp',
  auth: { 
    username: 'user', 
    password: 'password'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
