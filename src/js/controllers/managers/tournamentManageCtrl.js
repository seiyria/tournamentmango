import site from '../../app';

site.controller('tournamentManageController', ($scope, $state, ShareToken, SidebarManagement, EnsureLoggedIn, TournamentManagement, CurrentTournaments, CurrentPlayerBucket, TournamentStatus, UserStatus) => {
  SidebarManagement.hasSidebar = true;
  const authData = EnsureLoggedIn.check();

  $scope.playersAvailable = CurrentPlayerBucket.get().length;

  $scope.tStatus = TournamentStatus;

  $scope.tournaments = [];
  $scope.visibleTournaments = [];
  $scope.selected = [];

  $scope.datatable = {
    filter: '',
    order: '-name',
    limit: 10,
    page: 1,
    bookmark: 1
  };

  $scope.filter = { options: { throttle: 500 } };

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

    $scope.getTournaments();
  };

  $scope.$watch('datatable.filter', filterWatch);

  $scope.toggleShowArchived = () => {
    $scope.showArchived = !$scope.showArchived;
    $scope.getTournaments();
  };

  $scope.getTournaments = () => $scope.visibleTournaments = TournamentManagement.filterTournaments($scope.tournaments, $scope.datatable, $scope.showArchived);

  $scope.addItem = (event) => {
    TournamentManagement.addItem(event, newTournament => {
      $scope.tournaments.$add(newTournament);
    });
  };

  $scope.tournamentName = TournamentManagement.getTournamentEventNameFromId;

  $scope.editItem = (event) => {
    TournamentManagement.editItem(event, $scope.selected[0], oldTournament => {
      const item = $scope.tournaments.$getRecord(oldTournament.$id);
      _.extend(item, oldTournament);
      $scope.tournaments.$save(item);
    });
  };

  $scope.removeItem = (event) => {
    TournamentManagement.removeItem(event, $scope.selected, () => {
      _.each($scope.selected, tournament => {
        const item = $scope.tournaments.$getRecord(tournament.$id);
        $scope.tournaments.$remove(item);
      });

      $scope.selected = [];
    });
  };

  $scope.archiveItem = (event) => {
    TournamentManagement.archiveItem(event, $scope.selected, () => {
      _.each($scope.selected, tournament => {
        const item = $scope.tournaments.$getRecord(tournament.$id);
        item.archived = !item.archived;
        $scope.tournaments.$save(item);
      });

      $scope.selected = [];
    });
  };

  $scope.startTournament = (id) => {
    $state.go('setupTournament', { tournamentId: id });
  };

  $scope.seeTournament = (id) => {
    $state.go('tournamentInProgress', { userId: ShareToken(UserStatus.firebase.playerSetUid), tournamentId: id, setId: UserStatus.firebase.playerSet });
  };

  $scope.loadTournaments = () => {
    $scope.tournaments = CurrentTournaments.get();
    $scope.tournaments.$loaded($scope.getTournaments);
    $scope.tournaments.$watch($scope.getTournaments);
  };

  UserStatus.firebase.$loaded(() => {
    $scope.isMine = UserStatus.firebase.playerSetUid === authData.uid;
  });

  CurrentTournaments.watch.then(null, null, () => {
    $scope.loadTournaments();
  });

  $scope.loadTournaments();
});