import site from '../app';

site.service('EnsureLoggedIn', (UserStatus, $state) => {
  return {
    check: () => {
      if(UserStatus.loggedIn) return UserStatus.authData;
      $state.go('home');
    }
  };
});