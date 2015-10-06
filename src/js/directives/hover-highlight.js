import site from '../app';

site.directive('hoverHighlight', () => {
  return {
    restrict: 'A',
    link: (scope, element, attrs) => {

      $(element).hover(
        () => {
          if(!attrs.hoverName) return;
          $(`[hover-name='${attrs.hoverName}']`).addClass('bad-material-color-stuff');
        }, () => {
          $(`[hover-name='${attrs.hoverName}']`).removeClass('bad-material-color-stuff');
        }
      );
    }
  };
});