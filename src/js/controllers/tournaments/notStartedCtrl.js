import site from '../../app';

site.controller('notStartedController', ($scope, EnsureLoggedIn, UserStatus, ShareToken, TournamentStatus, FirebaseURL, $firebaseObject, CurrentPlayerBucket, CurrentTournament, $state, $stateParams) => {

  const authData = EnsureLoggedIn.check();

  $scope.bucket = CurrentPlayerBucket.get();
  CurrentPlayerBucket.watch.then(null, null, bucket => $scope.bucket = bucket);

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

  const stringToArray = (string) => _.compact(_.map(string.split(','), s => parseInt(s.trim()))) || [];

  $scope.tournamentOptions = {
    type: 'singles'
  };

  $scope.setStringArrValue = (key, value) => $scope.tournamentOptions[key] = stringToArray($scope.tournamentOptions[value]);

  if($scope.bucket.length === 0) return $state.go('userManage'); // don't refresh the page here, I guess

  $scope.getOptions = () => {
    const type = $scope.tournamentOptions.type;
    if(type === 'singles' || type === 'doubles') return _.extend({ last: type === 'singles' ? Duel.WB : Duel.LB }, $scope.tournamentOptions);
    return $scope.tournamentOptions;
  };

  $scope.isInvalid = () => {
    const type = $scope.tournamentOptions.type;
    if(type === 'singles' || type === 'doubles') return Duel.invalid($scope.bucket.length, $scope.getOptions());
    if(type === 'groupstage') return GroupStage.invalid($scope.bucket.length, $scope.getOptions());
    if(type === 'ffa') return FFA.invalid($scope.bucket.length, $scope.getOptions());
    if(type === 'masters') return Masters.invalid($scope.bucket.length, $scope.getOptions());
    return true;
  };

  $scope.sort = {
    descending: () => $scope.bucket = _.sortByOrder($scope.bucket, ['points', 'wins'], ['desc', 'desc']),
    shuffle: () => $scope.bucket = _.shuffle($scope.bucket),
    stagger: () => {
      $scope.sort.descending();

      const newOrder = [];
      for(let i = $scope.bucket.length-1; i >= 0; i--) {
        const item = $scope.bucket[i];
        const func = i % 2 === 0 ? 'unshift' : 'push';
        newOrder[func](item);
      }
      $scope.bucket = newOrder;
    }
  };

  $scope.removeFromBucket = CurrentPlayerBucket.remove;

  $scope.baseGroupSize = () => ~~Math.sqrt($scope.bucket.length);

  $scope.start = () => {
    const ref = $firebaseObject(new Firebase(`${FirebaseURL}/users/${UserStatus.firebase.playerSetUid}/players/${UserStatus.firebase.playerSet}/tournaments/${$stateParams.tournamentId}`));

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
        $state.go('tournamentInProgress', { userId: ShareToken(authData.uid), tournamentId: $stateParams.tournamentId, setId: UserStatus.firebase.playerSet });
      });
    });
  };

});