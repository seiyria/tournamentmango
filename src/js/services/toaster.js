import site from '../app';

site.service('Toaster', ($mdToast) => {
  return {
    show: (string) => {
      $mdToast.show($mdToast.simple()
        .content(string)
        .action('OK')
        .position('top right'));
    }
  };
});