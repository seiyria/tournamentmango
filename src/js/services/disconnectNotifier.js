import site from '../app';
import Firebase from 'firebase';

site.service('DisconnectNotifier', (FirebaseURL) => {
  const firebase = new Firebase(`${FirebaseURL}/.info/connected`);

  const callbacks = {
    on: () => {},
    off: () => {}
  };

  firebase.on('value', (snap) => {
    if(snap.val()) {
      callbacks.on();
    } else {
      callbacks.off();
    }
  });

  return {
    setCallback: (key, callback) => callbacks[key] = callback
  };
});