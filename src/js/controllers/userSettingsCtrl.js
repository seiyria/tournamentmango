import site from '../app';
import { saveAs } from '../../../bower_components/FileSaver.js/dist/FileSaver';

site.controller('userSettingsController', (db, $scope, SidebarManagement, EnsureLoggedIn, ShareToken, $firebaseObject, Toaster) => {

  SidebarManagement.hasSidebar = true;
  const authData = EnsureLoggedIn.check();

  $scope.shareId = ShareToken(authData.uid);

  const data = $firebaseObject(db.ref(`users/${authData.uid}`));

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
    saveAs(blob, `info-${Date.now()}.tournamentmango`);
  };
});