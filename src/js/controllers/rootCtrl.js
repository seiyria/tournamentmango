import site from '../app';

site.controller('rootController', ($scope, UserStatus) => {
  $scope.userStatus = UserStatus;
});