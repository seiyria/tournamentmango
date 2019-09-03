import site from '../../app';

site.service('CurrentEvents', (db, $q, $firebaseArray, UserStatus) => {
  const defer = $q.defer();
  
  let ref = $firebaseArray(db.ref(`users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}/events`));

  UserStatus.firebase.$watch(() => {
    ref = $firebaseArray(db.ref(`users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}/events`));
    defer.notify(ref);
  });

  return {
    get: () => ref,
    watch: defer.promise
  };
});