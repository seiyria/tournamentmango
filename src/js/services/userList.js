import site from '../app';

site.service('UserList', () => {

  const users = [];

  return {
    get: () => users
  };
});