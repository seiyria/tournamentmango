import site from '../app';

site.controller('rootController', ($scope, UserStatus, WrappedFirebase, $firebaseObject, SidebarManagement) => {
  $scope.userStatus = UserStatus;
  $scope.sidebar = SidebarManagement;
  $scope.data = $firebaseObject(WrappedFirebase);
});