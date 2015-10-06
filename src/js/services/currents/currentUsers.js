import site from '../../app';

site.service('CurrentUsers', ($q, $firebaseObject, FirebaseURL, Auth, UserStatus) => {

  let users = UserStatus.firebase ? $firebaseObject(new Firebase(`${FirebaseURL}/users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}`)) : {};
  const defer = $q.defer();

  const newUsers = () => {
    users = $firebaseObject(new Firebase(`${FirebaseURL}/users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}`));
    users.$loaded(() => {
      defer.notify(users);
    });
  };

  Auth.ready.then(() => {
    newUsers();
    UserStatus.firebase.$watch(newUsers);
  });

  return {
    get: () => users,
    watch: defer.promise
  };
});