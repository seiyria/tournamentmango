import site from '../app';

site.service('UserList', () => {

  const users = [];

  return {
    addUser: (user, success) => {
      users.push(user);
      success();
    },

    get: () => users
  };
});