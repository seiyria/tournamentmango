import site from '../../app';

site.controller('bracketInformationController', ($scope, $mdDialog, $filter, placeService, title, match, players) => {

  $scope.title = title;
  $scope.cancel = $mdDialog.cancel;
  $scope.players = [];

  for(let i = 0; i < match.score.length; i++) {
    const player = players[match.p[i] - 1];
    $scope.players.push({
      displayName: player.alias ? `${player.alias} (${player.name})` : player.name,
      score: match.score[i]
    });
  }

  $scope.players = $filter('orderBy')($scope.players, 'score', true);

  // state machine for determining ordinals ('1st', '2nd' and so on)
  const state = (() => {
    let lastScore = 0;
    let currentPlace = 0;
    let ordinal = placeService.getPlaceString(1);
    return {
      getOrdinal: (score) => {
        currentPlace++;
        if(lastScore === score) {
          return ordinal;
        }

        lastScore = score;
        return ordinal = placeService.getPlaceString(currentPlace);
      }
    };
  })();

  _.each($scope.players, (player) => {
    player.ordinal = state.getOrdinal(player.score);
  });
});
