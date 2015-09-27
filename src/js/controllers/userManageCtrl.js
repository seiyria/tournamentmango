import site from '../app';

site.controller('userManageController', ($scope, SidebarManagement, EnsureLoggedIn) => {
  SidebarManagement.hasSidebar = true;
  EnsureLoggedIn.check();

});