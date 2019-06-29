
const app = angular.module('openchallenge', [
  'ngAria', 'ngAnimate', 'ngMaterial', 'ngMdIcons', 'ngStorage',
  'ui.router', 'firebase', 'md.data.table', 'angular-sortable-view',
  'ngSanitize', 'angularInlineEdit'
]);

app.run(($window) => {

  // set up your firebase details here
  const firebaseConfig = {
    apiKey: '...',
    authDomain: 'project-id.firebaseapp.com',
    databaseURL: 'https://project-id.firebaseio.com',
    projectId: 'project-id',
    storageBucket: '',
    messagingSenderId: '...',
    appId: '...'
  };

  $window.firebase.initializeApp(firebaseConfig);
});

export default app;