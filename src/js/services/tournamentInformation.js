import site from '../app';

site.service('TournamentInformation', () => {

  let numMatchesPerSection = [];

  let idMap = {};
  let badIds = 0;

  const reset = (trn) => {
    idMap = {};
    badIds = 0;

    const totalSections = _.max(trn.matches, 'id.s').id.s; // get the highest section
    numMatchesPerSection = _.map(new Array(totalSections), () => 0);
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

  const determineTournament = (options) => {
    const hash = { singles: Duel, doubles: Duel, groupstage: GroupStage, ffa: FFA , masters: Masters };
    if(!options.type && options.last) return Duel;
    return hash[options.type];
  };

  const matchesLeft = (trn) => trn ? _.reduce(trn.matches, ((prev, m) => prev + (noRender(m) ? 0 : ~~!m.m)), 0) : 0;

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

  const playerName = (user) => {
    if(!user) return;
    if(user.alias) return user.alias;
    return user.name;
  };

  const getString = (strings, matchId, idx = 0) => {
    const obj = _.findWhere(strings, { id: matchId });
    if(!obj) return 'TBD';
    return obj.strings[idx];
  };

  return {
    loadTournamentWinnerStrings,
    determineTournament,
    getIdForMatch,
    getMatchIdString,
    getMatchStationIdString,
    getString,
    matchesLeft,
    noRender,
    playerName,
    reset
  };
});