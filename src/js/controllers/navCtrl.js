import site from '../app';

site.controller('navController', ($scope, $mdSidenav) => {
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
      name: 'Google+',
      icon: 'google-plus'
    }
  ];

  $scope.doLogin = (service) => {
    console.log(service);
  };
});