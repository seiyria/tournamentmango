import site from '../../app';

site.controller('tournamentDialogController', ($scope, $mdDialog, tournament, CurrentEvents, TournamentStatus) => {

  $scope.cancel = $mdDialog.cancel;

  const success = (item) => $mdDialog.hide(item);

  $scope.label = _.keys(tournament).length > 0 ? 'Edit' : 'Add';

  $scope.item = _.extend({}, tournament);
  $scope.allEvents = CurrentEvents;

  $scope.addItem = () => {
    $scope.item.form.$setSubmitted();

    if($scope.item.form.$valid) {
      const newItem = _.omit($scope.item, 'form');
      newItem.status = TournamentStatus.NOT_STARTED;
      success(newItem);
    }
  };
});