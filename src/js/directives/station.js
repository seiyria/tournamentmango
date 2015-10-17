import site from '../app';

site.directive('station', ($timeout) => {
  return {
    restrict: 'E',
    templateUrl: 'station',
    scope: {
      value: '=',
      canClick: '@',
      onUnedit: '&'
    },
    link: (scope, element, attrs) => {
      scope.editing = false;
      scope.editStuff = { value: scope.value };

      scope.edit = () => {
        if(!attrs.canClick) return;
        scope.editing = true;
        $timeout(() => {
          $(element).find('.station-input').focus();
          $(element).find('.station-input').select();
        }, 0);
      };

      scope.unedit = () => {
        scope.editing = false;
        scope.onUnedit();
      };

      scope.watchKeyPresses = (e) => {
        if(e.which !== 13) return;
        scope.unedit();
      };

      scope.$watch('editStuff.value', (newVal) => scope.value = newVal);
    }
  };
});