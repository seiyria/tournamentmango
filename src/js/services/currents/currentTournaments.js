import site from '../../app';

site.service('CurrentTournaments', ($q, $firebaseArray, FirebaseURL, UserStatus) => {
  const defer = $q.defer();

  let ref = $firebaseArray(new Firebase(`${FirebaseURL}/users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}/tournaments`));

  UserStatus.firebase.$watch(() => {
    ref = $firebaseArray(new Firebase(`${FirebaseURL}/users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}/tournaments`));
    defer.notify(ref);
  });

  return {
    get: () => ref,
    watch: defer.promise
  };
});