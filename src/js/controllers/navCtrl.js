import site from '../app';

site.controller('navController', ($scope, $mdSidenav) => {
  $scope.toggleList = () => {
    $mdSidenav('left').toggle();
  };
});