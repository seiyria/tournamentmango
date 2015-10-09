import site from '../../app';

site.controller('tournamentDialogController', ($scope, $mdDialog, tournament, CurrentEvents, CurrentUsers, FilterUtils, TournamentStatus) => {

  $scope.cancel = $mdDialog.cancel;

  const success = (item) => $mdDialog.hide(item);

  $scope.label = _.keys(tournament).length > 0 ? 'Edit' : 'Add';

  $scope.item = _.extend({}, tournament);
  $scope.allEvents = CurrentEvents.get();

  $scope.users = CurrentUsers.get();
  $scope.getGames = (query = '') => FilterUtils.getAndFilter($scope.users.list, 'games', query);

  $scope.addItem = () => {
    $scope.item.form.$setSubmitted();

    if($scope.item.form.$valid) {
      const newItem = _.omit($scope.item, 'form');
      newItem.status = newItem.status || TournamentStatus.NOT_STARTED;
      success(newItem);
    }
  };
});