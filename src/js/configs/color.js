import site from '../app';

site.config($mdThemingProvider => {
  $mdThemingProvider
    .theme('default')
    .primaryPalette('green', {
      default: '600'
    })
    .accentPalette('orange', {
      default: '800'
    });
});