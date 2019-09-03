import site from '../../app';

site.controller('sharePromptController', ($scope, db, $mdDialog, $firebaseObject, title, defaultValue) => {

  const allUsers = $firebaseObject(db.ref('users'));

  $scope.cancel = $mdDialog.cancel;

  const success = (item) => $mdDialog.hide(item);

  $scope.title = title;
  $scope.sharedWith = defaultValue;

  $scope.getUser = (searchKey) => {
    try {
      const key = atob(searchKey);
      return allUsers[key] ? [{ name: allUsers[key].name, uid: key }] : [];
    } catch(e) {
      return [];
    }
  };

  $scope.submit = () => {
    success($scope.sharedWith);
  };
});