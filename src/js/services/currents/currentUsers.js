import site from '../../app';

site.service('CurrentUsers', (db, $q, $firebaseObject, Auth, UserStatus) => {

  
  let users = UserStatus.firebase ? $firebaseObject(db.ref(`users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}`)) : {};
  const defer = $q.defer();

  let oldSetId = '';

  const newUsers = () => {
    const isNewSet = oldSetId !== UserStatus.firebase.playerSet;
    oldSetId = UserStatus.firebase.playerSet;
    users = $firebaseObject(db.ref(`users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}`));
    users.$loaded(() => {
      defer.notify({ users, isNewSet });
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