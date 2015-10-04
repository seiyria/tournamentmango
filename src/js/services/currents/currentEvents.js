import site from '../../app';

site.service('CurrentEvents', ($q, $firebaseArray, FirebaseURL, UserStatus) => {
  const defer = $q.defer();

  let ref = $firebaseArray(new Firebase(`${FirebaseURL}/users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}/events`));

  UserStatus.firebase.$watch(() => {
    ref = $firebaseArray(new Firebase(`${FirebaseURL}/users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}/events`));
    defer.notify(ref);
  });

  return {
    get: () => ref,
    watch: defer.promise
  };
});