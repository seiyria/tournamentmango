import site from '../../app';

site.service('CurrentTournaments', (db, $q, $firebaseArray, Auth, UserStatus, EnsureLoggedIn) => {
  
  EnsureLoggedIn.check();

  const defer = $q.defer();

  let ref = {};

  const load = () => {
    ref = $firebaseArray(db.ref(`users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}/tournaments`));
    defer.notify(ref);
  };

  Auth.ready.then(() => {
    UserStatus.firebase.$loaded(load);
    UserStatus.firebase.$watch(load);
  });

  return {
    get: () => ref,
    watch: defer.promise
  };
});