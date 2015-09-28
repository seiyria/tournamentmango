import site from '../app';

site.controller('userDialogController', ($scope, $mdDialog, UserList) => {

  $scope.cancel = $mdDialog.cancel;

  const success = (item) => $mdDialog.hide(item);

  $scope.item = {
    aliases: [],
    games: [],
    characters: []
  };

  $scope.addItem = () => {
    $scope.item.form.$setSubmitted();

    if($scope.item.form.$valid) {
      UserList.addUser($scope.item, success);
    }
  };
});