import site from '../app';

// bind scroll so the stupid things move horizontally
// fix the stupid vertical crap b/c its bad
site.directive('scrollObserve', ($timeout) => {
  return (scope, element, attrs) => {
    const window = $('.scroller');
    const setSize = () => {
      const width = $('.duel-area').hasClass('big-scores') ? 495 : 330;
      $(element).css('left', -window.scrollLeft()+width*(+attrs.scrollObserve)+'px');
    };
    $timeout(setSize, 0);
    window.on('scroll', setSize);
  };
});