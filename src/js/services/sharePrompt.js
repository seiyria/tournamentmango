import site from '../app';

site.service('SharePrompt', ($mdDialog) => {
  return {
    show: (event, opts = {}, callback) => {
      const locals = _.extend({  defaultValue: [],  title: '' }, opts);

      const mdDialogOptions = {
        event, locals,
        clickOutsideToClose: true,
        controller: 'sharePromptController',
        focusOnOpen: false,
        templateUrl: '/dialog/share-prompt'
      };

      $mdDialog.show(mdDialogOptions).then(callback);
    }
  };
});