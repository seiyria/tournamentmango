
import site from '../app';
import Firebase from 'firebase';

site.service('WrappedFirebase', () => {
  return new Firebase('https://openchallenge.firebaseio.com');
});