import site from '../app';
import Firebase from 'firebase';
import _, { extend, clone, each } from 'lodash';

site.controller('userManageController', ($scope, $q, $mdDialog, $mdToast, $firebaseArray, FirebaseURL, SidebarManagement, EnsureLoggedIn) => {
  SidebarManagement.hasSidebar = true;
  const authData = EnsureLoggedIn.check();

  let bookmark = 1;

  $scope.datatable = {
    filter: '',
    order: '-name',
    limit: 15,
    page: 1
  };

  $scope.filter = {
    options: {
      debounce: 500
    }
  };

  $scope.users = $firebaseArray(new Firebase(`${FirebaseURL}/users/${authData.uid}/players`));

  $scope.getUsers = () => {

    const filterArr = (user, arr) => user[arr] ? user[arr].join(' ').toLowerCase() : '';
    const startIndex = $scope.datatable.limit * ($scope.datatable.page-1);
    const endIndex = startIndex + $scope.datatable.limit;
    const doReverse = $scope.datatable.order.charAt(0) === '-';
    let order = $scope.datatable.order;

    if(doReverse) {
      order = order.substring(1);
    }

    $scope.visibleUsers = _($scope.users)
      .filter(user => {
        const filter = $scope.datatable.filter.toLowerCase();
        return filter.length === 0 ? true :
          _.contains(user.name.toLowerCase(), filter) ||
          _.contains(user.location.toLowerCase(), filter) ||
          _.contains(filterArr(user, 'aliases'), filter) ||
          _.contains(filterArr(user, 'games'), filter) ||
          _.contains(filterArr(user, 'characters'), filter);
      })
      .sortByOrder([order], [doReverse ? 'asc' : 'desc'])
      .slice(startIndex, endIndex)
      .value();
  };

  $scope.users.$loaded($scope.getUsers);
  $scope.users.$watch($scope.getUsers);

  const defaultMdDialogOptions = {
    clickOutsideToClose: true,
    controller: 'userDialogController',
    focusOnOpen: false,
    templateUrl: '/dialog/adduser'
  };

  $scope.addItem = (event) => {
    const mdDialogOptions = clone(defaultMdDialogOptions);
    mdDialogOptions.event = event;
    mdDialogOptions.locals = { player: {} };
    $mdDialog.show(mdDialogOptions).then(newPlayer => {
      $scope.users.$add(newPlayer);
    });
  };

  $scope.editItem = (event) => {
    const mdDialogOptions = clone(defaultMdDialogOptions);
    mdDialogOptions.event = event;
    mdDialogOptions.locals = { player: $scope.selected[0] };
    $mdDialog.show(mdDialogOptions).then(oldPlayer => {
      const item = $scope.users.$getRecord(oldPlayer.$id);
      extend(item, oldPlayer);
      $scope.users.$save(item);
    });
  };

  $scope.removeItem = (event) => {
    const players = $scope.selected;
    const dialog = $mdDialog.confirm()
      .targetEvent(event)
      .title('Remove Player')
      .content(`Are you sure you want to remove ${players.length} players?`)
      .ok('OK')
      .cancel('Cancel');

    $mdDialog.show(dialog).then(() => {

      each(players, player => {
        const item = $scope.users.$getRecord(player.$id);
        $scope.users.$remove(item);
      });

      $mdToast.show($mdToast.simple()
        .content(`Successfully removed ${players.length} players.`)
        .action('OK')
        .position('top right'));

      $scope.selected = [];
    });
  };

  $scope.hideSearch = () => {
    $scope.datatable.filter = '';
    $scope.filter.show = false;
    if($scope.filter.form.$dirty) {
      $scope.filter.form.$setPristine();
    }
  };

  $scope.selected = [];

  const callback = (newValue, oldValue) => {
    if(!oldValue) {
      bookmark = $scope.datatable.page;
    }

    if(newValue !== oldValue) {
      $scope.datatable.page = 1;
    }

    if(!newValue) {
      $scope.datatable.page = bookmark;
    }

    $scope.getUsers();
  };

  $scope.$watch('datatable.filter', _.throttle(callback, 500));
});