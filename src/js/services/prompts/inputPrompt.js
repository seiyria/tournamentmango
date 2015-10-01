import site from '../../app';

site.service('InputPrompt', ($mdDialog) => {
  return {
    show: (event, opts = {}, callback) => {
      const locals = _.extend({ name: 'Enter data', defaultValue: '', label: 'Data', invalidValues: [] }, opts);

      const mdDialogOptions = {
        event, locals,
        clickOutsideToClose: true,
        controller: 'inputPromptController',
        focusOnOpen: false,
        templateUrl: '/dialog/input-prompt'
      };

      $mdDialog.show(mdDialogOptions).then(callback);
    }
  };
});