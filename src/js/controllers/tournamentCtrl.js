import site from '../app';

site.controller('tournamentController', ($scope, SidebarManagement, EnsureLoggedIn) => {
  SidebarManagement.hasSidebar = true;
  EnsureLoggedIn.check();

});