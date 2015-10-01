import site from '../app';

site.controller('userSettingsController', ($scope, SidebarManagement, EnsureLoggedIn, FirebaseURL, $firebaseObject, Toaster) => {

  SidebarManagement.hasSidebar = true;
  const authData = EnsureLoggedIn.check();

  $scope.shareId = btoa(authData.uid);

  const data = $firebaseObject(new Firebase(`${FirebaseURL}/users/${authData.uid}`));

  const clipboard = new Clipboard('#copy-id');
  clipboard.on('success', () => {
    Toaster.show(`Copied ID to clipboard!`);
  });

  $scope.save = () => {
    const importantData = {
      events: data.events,
      players: data.players,
      tournaments: data.tournaments
    };
    const blob = new Blob([JSON.stringify(importantData)], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, `info-${Date.now()}.openchallenge`);
  };
});