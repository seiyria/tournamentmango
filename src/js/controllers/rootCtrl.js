import site from '../app';

site.controller('rootController', ($scope, UserStatus, SidebarManagement) => {
  $scope.userStatus = UserStatus;
  $scope.sidebar = SidebarManagement;
});