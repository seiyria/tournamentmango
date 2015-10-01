import site from '../app';

site.service('CurrentTournaments', ($firebaseArray, FirebaseURL, EnsureLoggedIn) => {
  const authData = EnsureLoggedIn.check();
  return $firebaseArray(new Firebase(`${FirebaseURL}/users/${authData.uid}/tournaments`));
});