
const app = angular.module('openchallenge', [
  'ngAria', 'ngAnimate', 'ngMaterial', 'ngMdIcons', 'ngStorage',
  'ui.router', 'firebase', 'md.data.table', 'angular-sortable-view',
  'ngSanitize', 'angularInlineEdit'
]);

app.run(($window) => {

  // set up your firebase details here
  const firebaseConfig = {
    apiKey: 'AIzaSyAW9Kxe3eFHgI11qrMw2HXT8F1OJPtsFIs',
    authDomain: 'openchallenge.firebaseapp.com',
    databaseURL: 'https://openchallenge.firebaseio.com'
  };

  $window.firebase.initializeApp(firebaseConfig);
});

export default app;
