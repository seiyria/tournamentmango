import site from '../app';

site.controller('navController', ($scope, $mdSidenav, Auth, DisconnectNotifier, SidebarManagement, UserStatus) => {

  $scope.toggleList = () => {
    $mdSidenav('left').toggle();
  };

  $scope.sidebar = SidebarManagement;

  $scope.auth = Auth;

  DisconnectNotifier.then(null, null, (connected) => {
    $scope.connected = connected;
  });

  $scope.userStatus = UserStatus;

});