import site from '../app';
import { omit, extend, keys } from 'lodash';

site.controller('userDialogController', ($scope, $mdDialog, player, viewOnly) => {

  $scope.cancel = $mdDialog.cancel;
  $scope.viewOnly = viewOnly;

  const success = (item) => $mdDialog.hide(item);

  $scope.label = keys(player).length > 0 ? 'Edit' : 'Add';

  $scope.item = extend({
    aliases: [],
    games: [],
    characters: []
  }, player);

  $scope.addItem = () => {
    $scope.item.form.$setSubmitted();

    if($scope.item.form.$valid) {
      success(omit($scope.item, 'form'));
    }
  };
});