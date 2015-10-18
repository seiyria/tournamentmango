import site from '../../app';

site.controller('upcomingController', ($scope, $mdMedia, $state, $stateParams, $firebaseObject, $timeout, FirebaseURL, SidebarManagement, EnsureLoggedIn, TournamentInformation) => {
  SidebarManagement.hasSidebar = false;
  EnsureLoggedIn.check(false);

  $scope.$mdMedia = $mdMedia;

  $scope.strings = [];

  $scope.viewBracket = () => $state.go('tournamentInProgress', $stateParams);

  $scope.matchesLeft = () => TournamentInformation.matchesLeft($scope.trn);

  $scope.shouldShow = (match) => !match.m && !_.all(match.p, p => p === 0);

  $scope.getString = (id, idx) => TournamentInformation.getString($scope.strings, id, idx);
  $scope.noRender = TournamentInformation.noRender;
  $scope.getMatchIdString = TournamentInformation.getMatchIdString;
  $scope.getStation = (match) => $scope.ref.stations[TournamentInformation.getMatchStationIdString(match)];

  const hasAnyZeroes = (match) => _.any(match.p, p => p === 0);

  $scope.isReady = (match) => {
    if($scope.noRender(match) || !$scope.shouldShow(match)) return;
    console.log($scope.getMatchIdString(match), ~~!!$scope.getStation(match), ~~!hasAnyZeroes(match));
    return ~~!!$scope.getStation(match) + ~~!hasAnyZeroes(match);
  };

  $scope.ref = $firebaseObject(new Firebase(`${FirebaseURL}/users/${atob($stateParams.userId)}/players/${$stateParams.setId}/tournaments/${$stateParams.tournamentId}`));

  $scope.getName = (idx) => TournamentInformation.playerName($scope.bucket[idx]);

  $scope.loadTournament = (ref, makeNew = false) => {
    $scope.tournamentName = $scope.ref.name;

    $scope.bucket = ref.players;

    const tournamentProto = TournamentInformation.determineTournament(ref.options);

    $scope.trn = ref.trn && !makeNew ? tournamentProto.restore($scope.bucket.length, ref.options, ref.trn) : new tournamentProto($scope.bucket.length, ref.options);

    TournamentInformation.reset($scope.trn);

    // cache them ids
    _.each($scope.trn.matches, $scope.getMatchIdString);

    if(!_.contains(['groupstage', 'ffa', 'masters'], ref.options.type)) {
      $timeout(() => $scope.strings = TournamentInformation.loadTournamentWinnerStrings($scope.trn), 0);
    }
  };

  $scope.ref.$watch(() => $scope.loadTournament($scope.ref));
});