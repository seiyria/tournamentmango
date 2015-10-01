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
      url: '/players',
      views: {
        'content@': { templateUrl: '/user-manage', controller: 'userManageController' },
        'sidebar@': { templateUrl: '/tournament-sidebar', controller: 'tournamentSidebarController' }
      }
    })
    .state('eventManage', {
      url: '/events',
      views: {
        'content@': { templateUrl: '/event-manage', controller: 'eventManageController' },
        'sidebar@': { templateUrl: '/tournament-sidebar', controller: 'tournamentSidebarController' }
      }
    })
    .state('tournamentManage', {
      url: '/tournaments',
      views: {
        'content@': { templateUrl: '/tournament-manage', controller: 'tournamentManageController' },
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