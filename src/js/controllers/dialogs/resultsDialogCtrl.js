import site from '../../app';

site.controller('resultsDialogController', ($scope, $mdDialog, tournamentName, results, players) => {

  $scope.cancel = $mdDialog.cancel;

  $scope.tournamentName = tournamentName;
  $scope.results = results;
  $scope.players = players;

  $scope.nameString = (idx) => {
    const player = $scope.players[idx-1];
    if(player.alias) return `${player.alias} (${player.name})`;
    return player.name;
  };

  $scope.toOrdinal = (num) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (s[(v-20)%10] || s[v] || s[0]);
  };
});