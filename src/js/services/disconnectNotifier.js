import site from '../app';
import Firebase from 'firebase';

site.service('DisconnectNotifier', ($q, FirebaseURL) => {
  const firebase = new Firebase(`${FirebaseURL}/.info/connected`);
  const defer = $q.defer();

  firebase.on('value', (snap) => {
    defer.notify(snap.val());
  });

  return defer.promise;
});