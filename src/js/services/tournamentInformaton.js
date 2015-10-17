import site from '../app';

site.service('TournamentInformation', () => {

  let numMatchesPerSection = [];

  let idMap = {};
  let badIds = 0;

  const reset = (opts) => {
    idMap = {};
    badIds = 0;
    numMatchesPerSection = _.map(new Array(opts.totalSections), () => 0);
  };

  const toCharacter = (round) => {
    let str = '';
    while(round > 0) {
      const modulo = (round-1)%26;
      str = String.fromCharCode(65+modulo) + str;
      round = Math.round((round - modulo) / 26);
    }
    return str;
  };

  const noRender = (match) => _.any(match.p, p => p === -1);

  const getIdForMatch = (match) => {
    const id = match.id;
    const strId = JSON.stringify(id);
    if(idMap[strId]) return idMap[strId];
    return idMap[strId] = noRender(match) ? ++badIds : ++numMatchesPerSection[id.s-1];
  };

  const getMatchIdString = (match) => {
    return `${match.id.s}-${toCharacter(getIdForMatch(match))}`;
  };

  const getMatchStationIdString = (match) => {
    return ''+match.id;
  };

  const loadTournamentWinnerStrings = (trn) => {

    const strings = [];

    const matchInfo = [
      { prefix: 'Winner of', genFunction: 'right' },
      { prefix: 'Loser of', genFunction: 'down', checkPassthrough: true, altFunction: 'right' }
    ];

    const isBad = (match) => _.any(match.p, p => p === -1);

    _.each(matchInfo, info => {
      _.each(trn.matches, match => {

        if(isBad(match)) {
          return;
        }

        let nextMatchInfo = trn[info.genFunction](match.id);
        if(!nextMatchInfo) {
          return;
        }

        let nextMatch = trn.findMatch(nextMatchInfo[0]);
        if(!nextMatch) {
          return;
        }

        if(_.isEqual(match, nextMatch)) {
          return;
        }

        if(info.checkPassthrough && isBad(nextMatch)) {
          const newNextMatchInfo = trn[info.altFunction](nextMatch.id);
          if(!newNextMatchInfo) return;
          nextMatchInfo = newNextMatchInfo;
          const obj = _.findWhere(trn.matches, { id: nextMatchInfo[0] });
          if(!obj) return;
          nextMatch = obj;
        }

        let stringObj = _.findWhere(strings, { id: nextMatch.id });
        if(!stringObj) {
          stringObj = { id: nextMatch.id, strings: [] };
          strings.push(stringObj);
        }

        stringObj.strings[nextMatchInfo[1]] = `${info.prefix} ${match.id.s}-${toCharacter(getIdForMatch(match))}`;
      });
    });

    return strings;
  };

  return {
    loadTournamentWinnerStrings,
    getIdForMatch,
    getMatchIdString,
    getMatchStationIdString,
    noRender,
    reset
  };
});