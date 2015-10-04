import site from '../app';

site.controller('tournamentSidebarController', ($scope, $state, $mdSidenav, CurrentPlayerBucket) => {
  $scope.playerBucket = CurrentPlayerBucket.get();

  CurrentPlayerBucket.watch.then(null, null, (item) => $scope.playerBucket = item);

  $scope.navigateTo = (state) => {
    $state.go(state);
    $mdSidenav('left').toggle();
  };
});