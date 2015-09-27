import site from './app';

site.config(($stateProvider, $urlRouterProvider) => {

  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      url: '/',
      views: {
        'content@': { templateUrl: '/home', controller: 'homeController' }
      }
    })
    .state('tournaments', {
      url: '/tournaments',
      views: {
        'content@': { templateUrl: '/tournaments', controller: 'tournamentController' },
        'sidebar@': { templateUrl: '/sidebar' }
      }
    });
});