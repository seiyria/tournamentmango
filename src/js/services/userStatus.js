import site from '../app';

site.service('UserStatus', () => {
  return {
    loggedIn: false,
    displayName: ''
  };
});