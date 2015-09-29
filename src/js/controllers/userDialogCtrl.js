import site from '../app';

site.controller('userDialogController', ($scope, $mdDialog, player, viewOnly) => {

  $scope.cancel = $mdDialog.cancel;
  $scope.viewOnly = viewOnly;

  const success = (item) => $mdDialog.hide(item);

  $scope.label = _.keys(player).length > 0 ? 'Edit' : 'Add';

  $scope.item = _.extend({
    aliases: [],
    games: [],
    characters: []
  }, player);

  $scope.addItem = () => {
    $scope.item.form.$setSubmitted();

    if($scope.item.form.$valid) {
      success(_.omit($scope.item, 'form'));
    }
  };
});