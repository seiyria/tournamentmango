import site from '../app';

site.controller('userManageController', ($scope, $mdDialog, SidebarManagement, EnsureLoggedIn) => {
  SidebarManagement.hasSidebar = true;
  EnsureLoggedIn.check();

  let bookmark = 1;

  $scope.datatable = {
    filter: '',
    order: 'name',
    limit: 25,
    page: 1
  };

  $scope.filter = {
    options: {
      debounce: 500
    }
  };

  // const success = (users) => $scope.users = users;

  $scope.onChange = () => null; // return a promise

  const getUsers = () => $scope.deferred = $scope.onChange();

  $scope.addItem = (event) => {
    $mdDialog.show({
      clickOutsideToClose: true,
      controller: 'userDialogController',
      focusOnOpen: false,
      targetEvent: event,
      templateUrl: '/dialog/adduser'
    }).then(getUsers);
  };

  $scope.hideSearch = () => {
    $scope.datatable.filter = '';
    $scope.filter.show = false;
    if($scope.filter.form.$dirty) {
      $scope.filter.form.$setPristine();
    }
  };

  $scope.users = [
    { name: 'James', aliases: [], wins: 10, losses: 5, points: 9000 },
    { name: 'Zen', aliases: [], wins: 1, losses: 10, points: 0 },
    { name: 'Shane', aliases: [], wins: 1, losses: 5, points: 5 },
    { name: 'Alex', aliases: [], wins: 10, losses: 3, points: 1000 },
    { name: 'Jan', aliases: [], wins: 10, losses: 1, points: 6 },
    { name: 'Zell', aliases: [], wins: 3, losses: 5, points: 9000 },
    { name: 'Apple', aliases: [], wins: 14, losses: 5, points: 100 }
  ];

  $scope.selected = [];

  $scope.$watch('datatable.filter', (newValue, oldValue) => {
    if(!oldValue) {
      bookmark = $scope.datatable.page;
    }

    if(newValue !== oldValue) {
      $scope.datatable.page = 1;
    }

    if(!newValue) {
      $scope.datatable.page = bookmark;
    }

    getUsers();
  });
});