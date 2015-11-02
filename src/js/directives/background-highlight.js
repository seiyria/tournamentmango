import site from '../app';

site.directive('backgroundHighlight', ($timeout) => {
  return {
    restrict: 'A',
    scope: {
      backgroundHighlight: '='
    },
    link: (scope, element) => {
      $timeout(() => {
        scope.$watch('backgroundHighlight', (newVal) => {
          const ref = $('body > md-toolbar');
          if(newVal) {
            $(element).css('background-color', ref.css('background-color')).css('color', ref.css('color'));
            $(element).find('.station-icon').css('fill', ref.css('color'));
          } else {
            $(element).css('background-color', '').css('color', '');
            $(element).find('.station-icon').css('fill', '');
          }
        });
      }, 0);
    }
  };
});