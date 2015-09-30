import site from '../app';

site.service('Auth', (WrappedFirebase, FirebaseURL, UserStatus, $state, $firebaseAuth, $firebaseObject) => {

  const loginTypes = [
    {
      name: 'Facebook',
      icon: 'facebook'
    },
    {
      name: 'Twitter',
      icon: 'twitter'
    },
    {
      name: 'Google',
      icon: 'google-plus'
    }
  ];

  const authBase = $firebaseAuth(WrappedFirebase);

  const handleAuth = (authData) => {
    const provider = authData.auth.provider;
    UserStatus.displayName = authData[provider].displayName;
    UserStatus.loggedIn = true;
    UserStatus.authData = authData;

    UserStatus.firebase = $firebaseObject(new Firebase(`${FirebaseURL}/users/${authData.uid}`));

    WrappedFirebase.child('users').once('value', (snapshot) => {
      if(snapshot.hasChild(authData.uid)) return;
      WrappedFirebase.child('users').set(authData.uid, {
        provider: authData.auth.provider,
        name: authData[authData.auth.provider].displayName
      });
    });
  };

  const attemptAuth = authBase.$getAuth();
  if(attemptAuth) handleAuth(attemptAuth);

  const doLogin = (service) => {
    authBase.$authWithOAuthPopup(service.toLowerCase())
      .then((authData) => {
        handleAuth(authData);
        $state.go('userManage');
      })
      .catch((error) => {
        console.error('Authentication failed', error);
      });
  };

  const doLogout = () => {
    authBase.$unauth();
    UserStatus.loggedIn = false;
    $state.go('home');
  };

  return {
    loginTypes,
    doLogin,
    doLogout
  };
});