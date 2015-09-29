import site from '../app';

site.controller('userManageController', ($scope, $firebaseArray, FirebaseURL, SidebarManagement, EnsureLoggedIn, UserManagement) => {
  SidebarManagement.hasSidebar = true;
  const authData = EnsureLoggedIn.check();

  $scope.datatable = {
    filter: '',
    order: '-name',
    limit: 10,
    page: 1,
    bookmark: 1
  };

  $scope.filter = { options: { throttle: 500 } };

  $scope.visibleUsers = [];
  $scope.selected = [];

  $scope.users = UserManagement.users = $firebaseArray(new Firebase(`${FirebaseURL}/users/${authData.uid}/players`));

  $scope.addItem = (event) => {
    UserManagement.addItem(event, newPlayer => {
      $scope.users.$add(newPlayer);
    });
  };

  $scope.editItem = (event) => {
    UserManagement.editItem(event, $scope.selected[0], oldPlayer => {
      const item = $scope.users.$getRecord(oldPlayer.$id);
      _.extend(item, oldPlayer);
      $scope.users.$save(item);
    });
  };

  $scope.removeItem = (event) => {
    UserManagement.removeItem(event, $scope.selected, () => {
      _.each($scope.selected, player => {
        const item = $scope.users.$getRecord(player.$id);
        $scope.users.$remove(item);
      });

      $scope.selected = [];
    });
  };

  $scope.viewItem = UserManagement.viewItem;

  $scope.getUsers = () => {
    $scope.visibleUsers = UserManagement.filterUsers($scope.users, $scope.datatable);
  };

  $scope.users.$loaded($scope.getUsers);
  $scope.users.$watch($scope.getUsers);

  $scope.hideSearch = () => {
    $scope.datatable.filter = '';
    $scope.filter.show = false;
    if($scope.filter.form.$dirty) {
      $scope.filter.form.$setPristine();
    }
  };

  const filterWatch = (newValue, oldValue) => {
    if(!oldValue) {
      $scope.datatable.bookmark = $scope.datatable.page;
    }

    if(newValue !== oldValue) {
      $scope.datatable.page = 1;
    }

    if(!newValue) {
      $scope.datatable.page = $scope.datatable.bookmark;
    }

    $scope.getUsers();
  };

  $scope.$watch('datatable.filter', filterWatch);

});