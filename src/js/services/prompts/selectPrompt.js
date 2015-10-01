import site from '../../app';

site.service('SelectPrompt', ($mdDialog) => {
  return {
    show: (event, opts = {}, callback) => {
      const locals = _.extend({ name: 'Enter data', defaultValue: '', label: 'Data', selectableValues: [] }, opts);

      const mdDialogOptions = {
        event, locals,
        clickOutsideToClose: true,
        controller: 'selectPromptController',
        focusOnOpen: false,
        templateUrl: '/dialog/select-prompt'
      };

      $mdDialog.show(mdDialogOptions).then(callback);
    }
  };
});