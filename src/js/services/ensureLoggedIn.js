import site from '../app';

site.service('EnsureLoggedIn', (UserStatus, $state) => {
  return {
    check: (autologout = true) => {
      if(UserStatus.loggedIn) return UserStatus.authData;
      if(autologout) $state.go('home');
    }
  };
});