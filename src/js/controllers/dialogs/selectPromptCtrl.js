import site from '../../app';

site.controller('selectPromptController', ($scope, $mdDialog, title, label, defaultValue, selectableValues) => {

  $scope.cancel = $mdDialog.cancel;

  const success = (item) => $mdDialog.hide(item);

  $scope.string = defaultValue;
  $scope.title = title;
  $scope.label = label;
  $scope.selectableValues = _.sortBy(selectableValues);
  $scope.groups = _.uniq(_.pluck(selectableValues, 'group'));

  console.log($scope.selectableValues, $scope.groups);

  $scope.submit = () => {
    $scope.form.$setSubmitted();

    if($scope.form.$valid) {
      success($scope.string);
    }
  };
});