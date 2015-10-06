import site from '../app';

site.directive('score', ($timeout) => {
  return {
    restrict: 'E',
    templateUrl: 'score',
    scope: {
      value: '='
    },
    link: (scope, element, attrs) => {
      scope.editing = false;
      scope.editStuff = { value: scope.value }; // don't bind to primitives, they said

      scope.edit = () => {
        if(!attrs.canClick) return;
        scope.editing = true;
        $timeout(() => {
          $(element).find('.score-input').focus();
          $(element).find('.score-input').select();
        }, 0);
      };
      scope.unedit = () => scope.editing = false;

      scope.watchKeyPresses = (e) => {
        if(e.which !== 13) return;
        scope.unedit();
      };

      scope.$watch('editStuff.value', (newVal) => scope.value = newVal);
    }
  };
});