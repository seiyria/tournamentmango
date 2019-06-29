import site from '../app';

site.service('db', function($window) {
  return $window.firebase.database();
});
