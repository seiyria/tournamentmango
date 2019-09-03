import site from '../app';

site.service('Auth', (UserStatus, db, $window, $q, $state, $firebaseAuth, $firebaseObject) => {
  
  const loaded = $q.defer();

  const loginTypes = [
    {
      name: 'Google',
      icon: 'google-plus'
    }
  ];

  
  const authBase = $firebaseAuth();

  const handleAuth = (authData) => {
    const providerId = authData.credential ? authData.credential.providerId : undefined;
    let provider;
    if(authData.isAnonymous) {
      UserStatus.displayName = 'Anon';
    } else {
      UserStatus.displayName = authData.user.displayName;
      provider = authData.user.providerData.find((d) => d.providerId === providerId);
    }
    UserStatus.loggedIn = true;
    UserStatus.authData = authData.user;

    UserStatus.firebase = $firebaseObject(db.ref(`users/${authData.user.uid}`));

    UserStatus.firebase.$loaded(() => {
      if(!UserStatus.firebase.provider) {
        UserStatus.firebase.provider = provider;
        UserStatus.firebase.$save();
      }

      if(!UserStatus.firebase.name) {
        UserStatus.firebase.name = provider.displayName;
        UserStatus.firebase.$save();
      }
      loaded.resolve();
    });
  };

  const attemptAuth = authBase.$getAuth();
  if(attemptAuth) handleAuth(attemptAuth);

  const doLogin = (service) => {
    const serv = service.toLowerCase();
    let authPromise;
    switch(serv) {
    case 'anonymous':  
      authPromise = authBase.$signInAnonymously();
      break;
    default:
      authPromise = authBase.$signInWithPopup(serv);
      break;
    }
    authPromise.then((authData) => {
      handleAuth(authData);
      $state.go('userManage');
    })
    .catch((error) => {
      console.error('Authentication failed', error);
    });
  };

  const doLogout = () => {
    authBase.$signOut();
    UserStatus.loggedIn = false;
    $state.go('home');
    $window.location.reload();
  };

  return {
    loginTypes,
    doLogin,
    doLogout,
    ready: loaded.promise
  };
});