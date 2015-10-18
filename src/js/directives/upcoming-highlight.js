import site from '../app';

site.directive('upcomingHighlight', () => {
  return {
    restrict: 'A',
    scope: {
      upcomingHighlight: '&'
    },
    link: (scope, element) => {
      scope.$watch(() => scope.upcomingHighlight(), (newVal) => {
        if(newVal < 2) return;
        const ref = $('body > md-toolbar');
        if(newVal) {
          $(element).css('background-color', ref.css('background-color')).css('color', ref.css('color'));
        } else {
          $(element).css('background-color', '').css('color', '');
        }
      });
    }
  };
});