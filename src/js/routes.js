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
    .state('userManage', {
      url: '/panel',
      views: {
        'content@': { templateUrl: '/user-manage', controller: 'userManageController' },
        'sidebar@': { templateUrl: '/tournament-sidebar', controller: 'tournamentSidebarController' }
      }
    })
    .state('tournaments', {
      url: '/tournaments',
      views: {
        'content@': { templateUrl: '/tournaments', controller: 'tournamentController' },
        'sidebar@': { templateUrl: '/tournament-sidebar', controller: 'tournamentSidebarController' }
      }
    })
    .state('userSettings', {
      url: '/settings',
      views: {
        'content@': { templateUrl: '/user-settings', controller: 'userSettingsController' },
        'sidebar@': { templateUrl: '/tournament-sidebar', controller: 'tournamentSidebarController' }
      }
    });
});