
import site from '../app';
import Firebase from 'firebase';

site.service('WrappedFirebase', () => {
  const ref = new Firebase('https://openchallenge.firebaseio.com');

  ref.onAuth(authData => {
    if(!authData) return;
    ref.child('users').child(authData.uid).set({
      provider: authData.auth.provider,
      name: authData[authData.auth.provider].displayName
    });
  });

  return ref;
});