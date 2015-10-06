import site from '../app';

site.service('Auth', (FirebaseURL, UserStatus, $window, $q, $state, $firebaseAuth, $firebaseObject) => {

  const loaded = $q.defer();

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

  const authBase = $firebaseAuth(new Firebase(FirebaseURL));

  const handleAuth = (authData) => {
    const provider = authData.auth.provider;
    UserStatus.displayName = authData[provider].displayName;
    UserStatus.loggedIn = true;
    UserStatus.authData = authData;

    UserStatus.firebase = $firebaseObject(new Firebase(`${FirebaseURL}/users/${authData.uid}`));

    UserStatus.firebase.$loaded(() => {
      if(!UserStatus.firebase.provider) {
        UserStatus.firebase.provider = authData.auth.provider;
        UserStatus.firebase.$save();
      }

      if(!UserStatus.firebase.name) {
        UserStatus.firebase.name = authData[authData.auth.provider].displayName;
        UserStatus.firebase.$save();
      }
      loaded.resolve();
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
    $window.location.reload();
  };

  return {
    loginTypes,
    doLogin,
    doLogout,
    ready: loaded.promise
  };
});