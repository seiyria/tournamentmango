import site from '../app';

site.config($locationProvider => {
  $locationProvider.hashPrefix('!');
});