import site from '../app';

const getId = (str) => {
  const chars = ['[', ']', '{', '}', '"', ':', ','];
  _.each(chars, char => str = str.split(char).join('-'));
  return str;
};

site.directive('drawTo', ($timeout) => {
  return (scope, element, attrs) => {
    if(!attrs.drawTo) return;
    const drawTo = JSON.parse(attrs.drawTo);
    if(!drawTo || $(`.line-${getId(JSON.stringify(drawTo))}`).length > 2) return;

    const checkDuplicates = (item) => {

      console.log('checking',item, item.attr('data-x'));

      const xOffset = ~~item.attr('data-x');

      const otherItems = $(`[data-x='${xOffset}']`).not(item[0]).add(`[data-x='${xOffset+4}']`);
      if(otherItems.length === 0) return 0;

      // what happens if there's duplicates
      let adjustment = 0;
      const push = 4;

      otherItems.each((i, el) => {

        // recalculate these each time in case they changed
        const myOffset = item.offset();
        const myTotalHeight = myOffset.top + item.width();

        const extra = $(el);
        const exOffset = extra.offset();

        if(exOffset.top < myTotalHeight && myTotalHeight < exOffset.top + extra.width()
          || exOffset.top < myOffset.top && myOffset.top < exOffset.top + extra.width()) {

          // push it 4px to the right
          item.css({ left: `+=${push}` });
          item.attr('data-x', ~~item.attr('data-x') + push);
          adjustment += push + checkDuplicates(item);
        }
      });

      return adjustment;
    };

    const drawLine = (x1, y1, x2, y2, thickness = 1, color = '#888') => {
      const length = Math.sqrt(((x2-x1) * (x2-x1)) + ((y2-y1) * (y2-y1)));
      const cx = ((x1 + x2) / 2) - (length / 2);
      const cy = ((y1 + y2) / 2) - (thickness / 2);
      const angle = Math.atan2((y1-y2),(x1-x2))*(180/Math.PI);
      const htmlLine = `<div class='line-${getId(JSON.stringify(drawTo))}' style='padding:0; margin:0; height: ${thickness}px; background-color:${color}; line-height:1px; position:absolute; left: ${cx}px; top: ${cy}px; width: ${length}px; transform:rotate(${angle}deg);' />`;

      const item = $(htmlLine);

      $('.duel-area').append(item);

      if(x1 === x2) {
        item.attr('data-x', ~~item.offset().left);
        return checkDuplicates(item);
      }
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

      // element + an offset
      const x1 = meBounds.left + meBounds.width + 10;
      const y1 = meBounds.top - (meBounds.height / 2) - headerBarOffset;

      // element - an offset
      const x2 = targetBounds.left - $targetRound.width() - 20;
      const y2 = targetBounds.top - (targetBounds.height) - 20 - headerBarOffset;

      const myRound = JSON.parse(attrs.matchId).r;
      const targetRound = drawTo[0].r;

      // if it's too far away, /2 is not a good midpoint
      const xModifier = targetRound - myRound === 1 ? 2 : 1;
      const subModifier = targetRound - myRound === 1 ? 0 : 10;

      const mid = x1+((x2-x1)/xModifier) - subModifier;

      const adjustment = ~~drawLine(mid, y1, mid, y2);
      drawLine(x1, y1, mid+adjustment, y1);
      drawLine(mid+adjustment, y2, x2, y2);

    }, 0);
  };
});