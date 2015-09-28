import site from '../app';

site.controller('tournamentSidebarController', ($scope, $state) => {
  $scope.events = [
    {
      name: 'OGS Th 9/21',
      tournaments: [
        {
          name: 'Tournament 1'
        },
        {
          name: 'Tournament 2'
        }
      ]
    }
  ];

  $scope.navigateTo = (state) => $state.go(state);
});