import site from '../app';

site.controller('userManageController', ($scope, $firebaseArray, $firebaseObject, FirebaseURL, InputPrompt, UserStatus, ShareManagement, SetManagement, SidebarManagement, EnsureLoggedIn, UserManagement) => {

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

  $scope.users = [];
  $scope.visibleUsers = [];
  $scope.selected = [];
  $scope.listKeys = [];

  $scope.userData = UserStatus;

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

  $scope.changePlayerSet = (name = 'default') => {
    UserStatus.firebase.playerSet = name;
    UserStatus.firebase.$save();

    $scope.setCurrentPlayerSet(name);
  };

  $scope.setCurrentPlayerSet = (name = 'default') => {
    $scope.setObject = $firebaseObject(new Firebase(`${FirebaseURL}/users/${authData.uid}/players/${name}`));
    $scope.setObject.$loaded(() => {
      if(!$scope.setObject._name) {
        $scope.setObject._name = name;
        $scope.setObject.$save();
      }
      if(!$scope.setObject.realName) {
        $scope.setObject.realName = name;
        $scope.setObject.$save();
      }
      if(!$scope.setObject.owner) {
        $scope.setObject.owner = authData.uid;
        $scope.setObject.$save();
      }
      $scope.loadUserList();
    });
  };

  $scope.hasMultipleSets = () => $scope.listKeys.length > 1;

  $scope.ownsCurrentSet = () => $scope.setObject ? $scope.setObject.owner === authData.uid : false;

  $scope.doNewSet = (event) => SetManagement.newSet(event, _.pluck($scope.listKeys, 'short'), $scope.changePlayerSet);

  $scope.doRename = (event) => SetManagement.renameSet(event, $scope.setObject.realName, $scope.renameCurrentPlayerSet);

  $scope.doDelete = (event) => SetManagement.deleteSet(event, $scope.removeSet);

  $scope.doChange = (event) => SetManagement.changeSet(event, $scope.setObject.realName, _.pluck($scope.listKeys, 'realName'), $scope.changeSetFromRealname);

  $scope.doOrOpen = (event) => $scope.isOpen ? $scope.doChange(event) : $scope.isOpen = true;

  $scope.openShareDialog = (event) => SetManagement.shareSet(event, $scope.setObject.realName, $scope.setObject.sharedWith, $scope.updateShareSettings);

  $scope.changeSetFromRealname = (newSet) => $scope.changePlayerSet(_.findWhere($scope.listKeys, { realName: newSet }).short);

  $scope.updateShareSettings = (shareData) => {
    const oldSharedWith = $scope.setObject.shareIDs;

    ShareManagement.manageSorting(oldSharedWith, shareData, $scope.setObject._name);

    $scope.setObject.shareIDs = _.pluck(shareData, 'uid');
    $scope.setObject.sharedWith = shareData;
    $scope.setObject.$save();
  };

  $scope.removeSet = () => {
    const oldSharedWith = $scope.setObject.shareIDs;
    ShareManagement.manageSorting(oldSharedWith, [], $scope.setObject._name);

    $scope.setObject.$remove().then(() => {
      $scope.changePlayerSet(_.sample($scope.listKeys).short);
    });
  };

  $scope.renameCurrentPlayerSet = (newName) => {
    if(!newName) return;
    $scope.setObject.realName = newName;
    $scope.setObject.$save();
  };

  $scope.loadUserList = () => {
    $scope.users = UserManagement.users = $firebaseArray($scope.setObject.$ref().child('list'));
    $scope.users.$loaded($scope.getUsers);
    $scope.users.$watch($scope.getUsers);
  };

  $scope.loadAllLists = () => {
    $scope.allLists = $firebaseObject(new Firebase(`${FirebaseURL}/users/${authData.uid}/players`));
    $scope.allLists.$watch(() => {
      $scope.listKeys = _.reject(_.keys($scope.allLists), (key) => _.contains(key, '$'));
      $scope.listKeys = _.map($scope.listKeys, (key) => {
        return { realName: $scope.allLists[key].realName, short: key };
      });
    });
  };

  $scope.load = () => {
    UserStatus.firebase.$loaded(() => {
      if(!UserStatus.firebase.playerSet) {
        $scope.changePlayerSet('default');
      }
      if(!$scope.setObject) {
        $scope.setCurrentPlayerSet(UserStatus.firebase.playerSet);
      }
    });
    $scope.loadAllLists();
  };

  $scope.load();

});