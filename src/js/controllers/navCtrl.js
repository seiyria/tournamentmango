import site from '../app';

site.controller('navController', ($scope, $mdSidenav, $state, UserStatus, WrappedFirebase, $firebaseAuth, SidebarManagement, DisconnectNotifier) => {
  $scope.toggleList = () => {
    $mdSidenav('left').toggle();
  };

  $scope.connected = true;

  DisconnectNotifier.setCallback('on', () => {
    $scope.connected = true;
  });

  DisconnectNotifier.setCallback('off', () => {
    $scope.connected = false;
  });

  $scope.sidebar = SidebarManagement;

  $scope.logins = [
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

  const auth = $firebaseAuth(WrappedFirebase);

  const handleAuth = (authData, wipe = true) => {
    const provider = authData.auth.provider;
    UserStatus.displayName = authData[provider].displayName;
    UserStatus.loggedIn = true;
    UserStatus.authData = authData;

    if(!wipe) return;
    WrappedFirebase.child('users').child(authData.uid).set({
      provider: authData.auth.provider,
      name: authData[authData.auth.provider].displayName
    });
  };

  const attemptAuth = auth.$getAuth();
  if(attemptAuth) handleAuth(attemptAuth, false);

  $scope.doLogin = (service) => {
    auth.$authWithOAuthPopup(service.toLowerCase())
    .then((authData) => {
      handleAuth(authData);
      $state.go('userManage');
    })
    .catch((error) => {
      console.error('Authentication failed', error);
    });
  };

  $scope.doLogout = () => {
    auth.$unauth();
    UserStatus.loggedIn = false;
    $state.go('home');
  };
});