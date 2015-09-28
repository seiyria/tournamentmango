
import site from '../app';
import Firebase from 'firebase';

site.service('WrappedFirebase', (FirebaseURL) => {
  const ref = new Firebase(FirebaseURL);

  return ref;
});