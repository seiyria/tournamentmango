import site from '../../app';

site.controller('inputPromptController', ($scope, $mdDialog, title, label, defaultValue, invalidValues) => {

  $scope.cancel = $mdDialog.cancel;

  const success = (item) => $mdDialog.hide(item);

  $scope.string = defaultValue;
  $scope.title = title;
  $scope.label = label;
  $scope.isValid = () => !_.contains(invalidValues, $scope.string);

  $scope.submit = () => {
    $scope.form.$setSubmitted();

    if($scope.form.$valid) {
      success($scope.string);
    }
  };
});