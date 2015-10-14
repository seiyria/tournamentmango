import site from '../app';

site.service('DisconnectNotifier', ($q, $window, FirebaseURL) => {
  const firebase = new Firebase(`${FirebaseURL}/.info/connected`);
  const defer = $q.defer();

  firebase.on('value', (snap) => {
    const val = snap.val();
    defer.notify(val);
    $window.onbeforeunload = val ? undefined : () => 'If you quit this app now, you may lose all unsynced data. Are you sure you want to do this?';
  });

  return defer.promise;
});