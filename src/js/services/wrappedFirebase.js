import site from '../app';

site.service('WrappedFirebase', (FirebaseURL) => {
  const ref = new Firebase(FirebaseURL);

  return ref;
});