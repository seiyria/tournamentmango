import site from '../../app';

site.controller('resultsDialogController', ($scope, $mdDialog, tournamentName, results, players, placeService) => {

  $scope.cancel = $mdDialog.cancel;

  $scope.tournamentName = tournamentName;
  $scope.results = results;
  $scope.players = players;

  $scope.nameString = (idx) => {
    const player = $scope.players[idx-1];
    if(player.alias) return `${player.alias} (${player.name})`;
    return player.name;
  };

  $scope.toOrdinal = placeService.getPlaceString;
});
