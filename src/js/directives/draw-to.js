import site from '../app';

site.directive('drawTo', ($timeout) => {
  return (scope, element, attrs) => {
    const drawTo = JSON.parse(attrs.drawTo);

    const drawLine = (x1, y1, x2, y2, thickness = 1, color = '#000') => {
      const length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
      const cx = ((x1 + x2) / 2) - (length / 2);
      const cy = ((y1 + y2) / 2) - (thickness / 2);
      const angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
      const htmlLine = `<div style='padding:0; margin:0; height: ${thickness}px; background-color:${color}; line-height:1px; position:absolute; left: ${cx}px; top: ${cy}px; width: ${length}px; transform:rotate(${angle}deg);' />`;

      $('.duel-area').append($(htmlLine));
    };

    $timeout(() => {
      const $me = $(element).children('.match-data');
      const $baseTarget = $(`[data-match-id='${JSON.stringify(drawTo[0])}']`);
      const $target = $baseTarget.find(`.member-${drawTo[1]}`);
      const $targetRound = $baseTarget.find('.round-type');
      if(!$target.length || !$me.length) return;

      const meBounds = $me[0].getBoundingClientRect();
      const targetBounds = $target[0].getBoundingClientRect();

      const headerBarOffset = $('.header-bar').height();
      console.log(headerBarOffset);

      // element + an offset
      const x1 = meBounds.left + meBounds.width + 10;
      const y1 = meBounds.top - (meBounds.height / 2) - 30 - headerBarOffset;

      // element - an offset
      const x2 = targetBounds.left - $targetRound.width() - 20;
      const y2 = targetBounds.top - (targetBounds.height) - 35 - headerBarOffset;

      const mid = x1+((x2-x1)/2);

      drawLine(x1, y1, mid, y1);
      drawLine(mid, y1, mid, y2);
      drawLine(mid, y2, x2, y2);

    }, 0);
  };
});