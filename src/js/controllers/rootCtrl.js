import site from '../app';

site.controller('rootController', ($scope, $state, $mdSidenav, UserStatus, SidebarManagement) => {
  $scope.userStatus = UserStatus;
  $scope.sidebar = SidebarManagement;
  $scope.dismissSidebar = () => $mdSidenav('left').toggle();

  // I'm a terrible person
  $scope.isMaxWidth = () => $state.$current.name === 'tournamentInProgress';
});