import site from '../app';

site.directive('score', ($timeout, $filter) => {
  return {
    restrict: 'E',
    templateUrl: 'score',
    scope: {
      value: '='
    },
    link: (scope, element, attrs) => {
      scope.editing = false;
      scope.editStuff = { value: scope.value }; // don't bind to primitives, they said
      scope.maxScore = 999;

      $timeout(() => {
        const bigScores = $('.duel-area').hasClass('big-scores');
        scope.maxScore = bigScores ? 999999999999 : 999;
      }, 0);

      scope.getValue = () => _.isNumber(scope.value) ? $filter('number')(scope.value, 0) : '-';

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

      scope.$watch('editStuff.value', (newVal) => scope.value = _.isNumber(newVal) ? newVal : 0);
    }
  };
});