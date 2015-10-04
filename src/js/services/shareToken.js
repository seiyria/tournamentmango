import site from '../app';

site.service('ShareToken', () => (userId) => {
  try {
    return btoa(userId);
  } catch (e) {
    return '';
  }
});