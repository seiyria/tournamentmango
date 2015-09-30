import site from '../../app';

site.controller('userDialogController', ($scope, $mdDialog, player, viewOnly, UserManagement, FilterUtils) => {

  $scope.cancel = $mdDialog.cancel;
  $scope.viewOnly = viewOnly;

  const success = (item) => $mdDialog.hide(item);

  $scope.label = _.keys(player).length > 0 ? 'Edit' : 'Add';

  $scope.getLocations = (query = '') => FilterUtils.getAndFilter(UserManagement.users, 'location', query);
  $scope.getGames = (query = '') => _.difference(FilterUtils.getAndFilter(UserManagement.users, 'games', query), $scope.item.games);
  $scope.getCharacters = (query = '') => _.difference(FilterUtils.getAndFilter(UserManagement.users, 'characters', query), $scope.item.characters);

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