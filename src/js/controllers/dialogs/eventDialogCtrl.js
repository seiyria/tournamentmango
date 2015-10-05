import site from '../../app';

site.controller('eventDialogController', ($scope, $mdDialog, tEvent, CurrentUsers, FilterUtils) => {

  $scope.cancel = $mdDialog.cancel;

  const success = (item) => $mdDialog.hide(item);

  $scope.label = _.keys(tEvent).length > 0 ? 'Edit' : 'Add';

  $scope.item = _.extend({}, tEvent);
  if($scope.item.date) $scope.item.date = new Date($scope.item.date);

  $scope.users = CurrentUsers.get();

  $scope.getLocations = (query = '') => FilterUtils.getAndFilter($scope.users.list, 'location', query);

  $scope.addItem = () => {
    $scope.item.form.$setSubmitted();

    if($scope.item.form.$valid) {
      const newItem = _.omit($scope.item, 'form');
      newItem.date = newItem.date.getTime();
      success(newItem);
    }
  };
});