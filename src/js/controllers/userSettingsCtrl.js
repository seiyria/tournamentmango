import site from '../app';

site.controller('userSettingsController', ($scope, SidebarManagement, EnsureLoggedIn) => {

  SidebarManagement.hasSidebar = true;
  const authData = EnsureLoggedIn.check();

  $scope.shareId = btoa(authData.uid);
});