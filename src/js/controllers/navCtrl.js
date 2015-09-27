import site from '../app';

site.controller('navController', ($scope, $mdSidenav, $state, UserStatus, WrappedFirebase, $firebaseAuth) => {
  $scope.toggleList = () => {
    $mdSidenav('left').toggle();
  };

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

  const handleAuth = (authData) => {
    const provider = authData.auth.provider;
    UserStatus.displayName = authData[provider].displayName;
    UserStatus.loggedIn = true;
  };

  const attemptAuth = auth.$getAuth();
  if(attemptAuth) handleAuth(attemptAuth);

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