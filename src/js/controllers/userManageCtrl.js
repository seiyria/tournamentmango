import site from '../app';
import Firebase from 'firebase';
import _, { extend, clone, each } from 'lodash';

site.controller('userManageController', ($scope, $q, $mdDialog, Toaster, $firebaseArray, FirebaseURL, SidebarManagement, EnsureLoggedIn) => {
  SidebarManagement.hasSidebar = true;
  const authData = EnsureLoggedIn.check();

  let bookmark = 1;

  $scope.datatable = {
    filter: '',
    order: '-name',
    limit: 10,
    page: 1
  };

  $scope.filter = {
    options: {
      debounce: 500
    }
  };

  $scope.users = $firebaseArray(new Firebase(`${FirebaseURL}/users/${authData.uid}/players`));

  $scope.getUsers = () => {

    // allow multiple filters separated by a comma
    const filter = _.compact(_.map($scope.datatable.filter.toLowerCase().split(','), (m) => m.trim()));

    // check if anything in the right is a substring in the left
    const containsAny = (left, right) => _.some(right, (filterKey) => _.some(left, (string) => _.contains(string, filterKey)));

    // get a filter array for user if they exist
    const filterArr = (user, arr) => user[arr] ? _.map(user[arr], (s) => s.toLowerCase()) : [];

    // pagination and stuff
    const startIndex = $scope.datatable.limit * ($scope.datatable.page-1);
    const endIndex = startIndex + $scope.datatable.limit;
    const doReverse = $scope.datatable.order.charAt(0) === '-';
    let order = $scope.datatable.order;

    if(doReverse) {
      order = order.substring(1);
    }

    $scope.visibleUsers = _($scope.users)
      .filter(user => {

        // only show people that match all criteria
        return filter.length === 0 ? true : _.reduce(
          [
            containsAny([user.name.toLowerCase()], filter),
            containsAny([user.location.toLowerCase()], filter),
            containsAny(filterArr(user, 'aliases'), filter),
            containsAny(filterArr(user, 'games'), filter),
            containsAny(filterArr(user, 'characters'), filter)
          ],
          (prev, cur) => prev + ~~cur,
          0
        ) >= filter.length;
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
    mdDialogOptions.locals = { player: {}, viewOnly: false };
    $mdDialog.show(mdDialogOptions).then(newPlayer => {
      $scope.users.$add(newPlayer);
    });
  };

  $scope.editItem = (event) => {
    const mdDialogOptions = clone(defaultMdDialogOptions);
    mdDialogOptions.event = event;
    mdDialogOptions.locals = { player: $scope.selected[0], viewOnly: false };
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

      Toaster.show(`Successfully removed ${players.length} players.`);

      $scope.selected = [];
    });
  };

  $scope.viewItem = (event, player) => {
    event.stopPropagation();
    const mdDialogOptions = clone(defaultMdDialogOptions);
    mdDialogOptions.event = event;
    mdDialogOptions.locals = { player, viewOnly: true };
    $mdDialog.show(mdDialogOptions).then(oldPlayer => {
      const item = $scope.users.$getRecord(oldPlayer.$id);
      extend(item, oldPlayer);
      $scope.users.$save(item);
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