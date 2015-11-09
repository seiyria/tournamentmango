import site from '../../app';

site.controller('userManageController', ($scope, $firebaseArray, $firebaseObject, $state, $stateParams, Auth, FirebaseURL, ScoringFunctions, CurrentUsers, InputPrompt, UserStatus, CurrentPlayerBucket, CurrentTournaments, ShareManagement, SetManagement, SidebarManagement, EnsureLoggedIn, UserManagement, TournamentStatus, Toaster) => {

  $scope.canOnlySelectUsers = () => $stateParams.userSelectOnly;
  $scope.backToTournamentsetup = () => $state.go('setupTournament', { tournamentId: $stateParams.tournamentId });

  SidebarManagement.hasSidebar = !$scope.canOnlySelectUsers();
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
  $scope.sharedLists = [];

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

    const mySet = _.findWhere($scope.listKeys, { short: name });
    UserStatus.firebase.playerSet = name;
    UserStatus.firebase.playerSetUid = mySet ? mySet.uid : authData.uid;

    $scope.isMine = UserStatus.firebase.playerSetUid === authData.uid;
    UserStatus.firebase.$save();
  };

  $scope.setCurrentPlayerSet = (setData, name = UserStatus.firebase.playerSet) => {
    $scope.setObject = setData;
    if(!$scope.canOnlySelectUsers()) {
      CurrentPlayerBucket.clear();
    }
    $scope.setObject.$loaded(() => {
      if(!$scope.setObject.basename && name) {
        $scope.setObject.basename = name;
        $scope.setObject.$save();
      }
      if(!$scope.setObject.realName && name) {
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

  CurrentUsers.watch.then(null, null, (data) => {
    if(!data.isNewSet) return;
    $scope.setCurrentPlayerSet(data.users);
  });

  $scope.hasMultipleSets = () => $scope.listKeys.length > 1;

  $scope.ownsCurrentSet = () => $scope.setObject ? $scope.setObject.owner === authData.uid : false;

  $scope.doNewSet = (event) => SetManagement.newSet(event, _.pluck($scope.listKeys, 'short'), $scope.changePlayerSet);

  $scope.doRename = (event) => SetManagement.renameSet(event, $scope.setObject.realName, $scope.renameCurrentPlayerSet);

  $scope.doDelete = (event) => SetManagement.deleteSet(event, $scope.removeSet);

  $scope.doChange = (event) => SetManagement.changeSet(event, $scope.setObject.realName, $scope.listKeys, $scope.changeSetFromRealname);

  $scope.doOrOpen = (event) => $scope.isOpen ? $scope.doChange(event) : $scope.isOpen = true;

  $scope.doExport = (event) => SetManagement.exportSet(event, _.reject($scope.listKeys, k => k.short === $scope.setObject.basename), $scope.exportToSet);

  $scope.openShareDialog = (event) => SetManagement.shareSet(event, $scope.setObject.realName, $scope.setObject.sharedWith, $scope.updateShareSettings);

  $scope.changeSetFromRealname = (newSet) => $scope.changePlayerSet(_.findWhere($scope.listKeys, { realName: newSet.short }).short);

  $scope.exportToSet = (newSet) => {
    const players = $scope.selected;

    const newSetPlayers = $firebaseArray(new Firebase(`${FirebaseURL}/users/${newSet.uid}/players/${newSet.short}/list`));

    const newPlayerObjs = _.map(players, p => _.omit(p, (v, key) => _.contains(key, '$') || _.contains(['wins', 'losses', 'points'], key)));

    newSetPlayers.$loaded(() => {
      _.each(newPlayerObjs, newSetPlayers.$add);
    });
  };

  $scope.updateShareSettings = (shareData) => {
    const oldSharedWith = _.keys($scope.setObject.shareIDs);

    ShareManagement.manageSorting(oldSharedWith, shareData, $scope.setObject.basename);

    $scope.setObject.shareIDs = _.reduce(_.pluck(shareData, 'uid'), (prev, cur) => {
      prev[cur] = true;
      return prev;
    }, {});
    $scope.setObject.sharedWith = shareData;
    $scope.setObject.$save();
  };

  $scope.removeSet = () => {
    const oldSharedWith = _.keys($scope.setObject.shareIDs);
    ShareManagement.manageSorting(oldSharedWith, [], $scope.setObject.basename);

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

  $scope.resetListKeys = () => {
    $scope.listKeys = _.reject(_.keys($scope.allLists), (key) => _.contains(key, '$'));
    $scope.listKeys = _.map($scope.listKeys, (key) => {
      return { realName: $scope.allLists[key].realName, short: key, uid: authData.uid, group: 'Mine' };
    });
    $scope.listKeys = $scope.listKeys.concat($scope.sharedLists);
  };

  $scope.loadAllLists = () => {
    $scope.allLists = $firebaseObject(new Firebase(`${FirebaseURL}/users/${authData.uid}/players`));
    $scope.allLists.$watch($scope.resetListKeys);
  };

  $scope.loadSharedWithMe = () => {
    const sharedWithMe = $firebaseObject(new Firebase(`${FirebaseURL}/shares/${authData.uid}`));
    sharedWithMe.$watch(() => {
      $scope.sharedLists = [];

      _.each(_.keys(sharedWithMe), (sharer) => {

        if(_.contains(sharer, '$')) return;
        const sharedbase = $firebaseObject(new Firebase(`${FirebaseURL}/users/${sharer}`));

        sharedbase.$loaded().then(() => {
          _.each(sharedWithMe[sharer], doc => {
            const sharename = sharedbase.name;
            const realDoc = sharedbase.players[doc];
            $scope.sharedLists.push({ realName: realDoc.realName, uid: sharer, short: realDoc.basename, group: `Shared by ${sharename}` });
          });
          $scope.resetListKeys();

        });
      });
    });
  };

  $scope.addToPlayerBucket = () => {
    CurrentPlayerBucket.add($scope.selected);
    Toaster.show(`Successfully added ${$scope.selected.length} players to bucket.`);
    $scope.selected = [];
  };

  $scope.currentPlayerBucketSize = () => CurrentPlayerBucket.get().length;

  $scope.anyCompletedTournaments = () => _.any($scope.tournaments, t => t.status === TournamentStatus.COMPLETED);
  $scope.allTournamentGames = () => _.uniq($scope.tournaments, t => t.game);

  $scope.recalculateScore = () => {
    $scope.calculating = true;

    _.each($scope.users, user => user.points = user.wins = user.losses = 0);

    _.each(_.filter($scope.tournaments, t => t.status === TournamentStatus.COMPLETED), tournament => {
      _.each(tournament.matches, match => {
        if(_.any(match.p, id => id === -1)) return; // skip hidden matches

        const result = _.findWhere(tournament.trn, { id: match.id });
        if(!result) return;
        _.each(match.p, (id, idx) => {
          const player = tournament.players[id-1];
          const ref = $scope.users.$getRecord(player.id);
          const winScore = _.max(result.score);
          const playerScore = result.score[idx];

          const key = playerScore === winScore ? 'wins' : 'losses';
          if(!ref[key]) ref[key] = 0;
          ref[key]++;
        });
      });
    });

    ScoringFunctions[UserStatus.firebase.scoreFunc]($scope.users);

    _.each($scope.users, p => {
      $scope.users.$save(p);
    });

    $scope.calculating = false;
  };

  $scope.saveFirebase = () => {
    UserStatus.firebase.$save();
    $scope.recalculateScore();
  };

  $scope.load = () => {
    Auth.ready.then(() => {
      UserStatus.firebase.$loaded(() => {

        if(!UserStatus.firebase.playerSet) {
          $scope.changePlayerSet('default');
        }

        $scope.setCurrentPlayerSet(CurrentUsers.get());

        $scope.isMine = UserStatus.firebase.playerSetUid === authData.uid;

        $scope.tournaments = CurrentTournaments.get();
        CurrentTournaments.watch.then(null, null, tournaments => $scope.tournaments = tournaments);
      });
      $scope.loadAllLists();
      $scope.loadSharedWithMe();
    });
  };

  $scope.load();

});