import site from '../app';

site.controller('rootController', ($scope, $mdSidenav, UserStatus, SidebarManagement) => {
  $scope.userStatus = UserStatus;
  $scope.sidebar = SidebarManagement;
  $scope.dismissSidebar = () => $mdSidenav('left').toggle();
});