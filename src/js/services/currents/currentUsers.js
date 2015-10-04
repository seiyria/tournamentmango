import site from '../../app';

site.service('CurrentUsers', ($q, $firebaseObject, FirebaseURL, UserStatus) => {

  let users = {};
  const defer = $q.defer();

  UserStatus.firebase.$watch(() => {
    users = $firebaseObject(new Firebase(`${FirebaseURL}/users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}`));
    defer.notify(users);
  });

  return {
    get: () => users,
    watch: defer.promise
  };
});