import site from '../app';

// bind scroll so the stupid things move horizontally
// fix the stupid vertical crap b/c its bad
site.directive('scrollObserve', () => {
  return (scope, element, attrs) => {
    const window = $('.scroller');
    const setSize = () => {
      $(element).css('left', -window.scrollLeft()+330*(+attrs.scrollObserve)+'px');
    };
    setSize();
    window.on('scroll', setSize);
  };
});