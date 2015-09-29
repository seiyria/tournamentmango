import site from '../app';

site.controller('userDialogController', ($scope, $mdDialog, player, viewOnly, UserManagement, FilterUtils) => {

  $scope.cancel = $mdDialog.cancel;
  $scope.viewOnly = viewOnly;

  const success = (item) => $mdDialog.hide(item);

  $scope.label = _.keys(player).length > 0 ? 'Edit' : 'Add';

  $scope.getLocations = (query = '') => {
    const locations = FilterUtils.getUniqueKeys(UserManagement.users, 'location');
    return FilterUtils.filterByContains(locations, query);
  };

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