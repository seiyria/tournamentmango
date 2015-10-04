import site from '../../app';

site.controller('notStartedController', ($scope, EnsureLoggedIn, ShareToken, TournamentStatus, FirebaseURL, $firebaseObject, CurrentPlayerBucket, CurrentTournament, $state, $stateParams) => {

  const authData = EnsureLoggedIn.check();

  $scope.bucket = CurrentPlayerBucket.get();
  CurrentPlayerBucket.watch.then(null, null, bucket => $scope.bucket = bucket);
  console.log($scope.bucket);

  $scope.toCharacter = (num) => {
    let bucket = Math.ceil(num/2);
    let str = '';
    while(bucket > 0) {
      const modulo = (bucket-1)%26;
      str = String.fromCharCode(65+modulo) + str;
      bucket = Math.round((bucket - modulo) / 26);
    }
    return str;
  };

  $scope.tournamentOptions = {
    type: 'singles',
    short: false
  };

  if($scope.bucket.length === 0) return $state.go('userManage'); // don't refresh the page here, I guess

  $scope.getOptions = () => {
    const type = $scope.tournamentOptions.type;
    if(type === 'singles' || type === 'doubles') return { last: type === 'singles' ? Duel.WB : Duel.LB, short: $scope.tournamentOptions.short };
    return {};
  };

  $scope.isInvalid = () => {
    const type = $scope.tournamentOptions.type;
    if(type === 'singles' || type === 'doubles') return Duel.invalid($scope.bucket.length, $scope.getOptions());
    return false;
  };

  $scope.removeFromBucket = CurrentPlayerBucket.remove;

  $scope.start = () => {
    const ref = $firebaseObject(new Firebase(`${FirebaseURL}/users/${authData.uid}/tournaments/${$stateParams.tournamentId}`));
    ref.$loaded().then(() => {
      ref.options = $scope.getOptions();
      ref.players = _.map($scope.bucket, (player) => {
        return {
          id: player.$id,
          name: player.name,
          alias: player.chosenAlias || ''
        };
      });
      ref.status = TournamentStatus.IN_PROGRESS;
      ref.$save().then(() => {
        CurrentPlayerBucket.clear();
        $state.go('tournamentInProgress', { userId: ShareToken(authData.uid), tournamentId: $stateParams.tournamentId });
      });
    });
  };

});