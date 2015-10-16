import site from '../app';

site.directive('hoverHighlight', () => {
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {

      $(element).hover(() => {
        if(!attrs.hoverName) return;
        const ref = $('body > md-toolbar');
        $(`[hover-name='${attrs.hoverName}']`).css('background-color', ref.css('background-color')).css('color', ref.css('color'));
      }, () => {
        $(`[hover-name='${attrs.hoverName}']`).css('background-color', '').css('color', '');
      });
    }
  };
});