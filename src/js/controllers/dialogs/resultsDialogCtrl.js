import site from '../../app';

site.controller('resultsDialogController', ($scope, $mdDialog, tournamentName, results, names) => {

  $scope.cancel = $mdDialog.cancel;

  $scope.tournamentName = tournamentName;
  $scope.results = results;
  $scope.names = names;

  $scope.toOrdinal = (num) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = num % 100;
    return num + (s[(v-20)%10] || s[v] || s[0]);
  };
});