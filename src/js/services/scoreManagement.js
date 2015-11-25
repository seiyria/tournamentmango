import site from '../app';

site.service('ScoreManagement', (CurrentTournaments, CurrentUsers, TournamentStatus, ScoringFunctions, UserStatus, $firebaseArray) => {

  let tournaments = CurrentTournaments.get();
  CurrentTournaments.watch.then(null, null, newTournaments => tournaments = newTournaments);

  const recalculateScore = () => {

    const users = $firebaseArray(CurrentUsers.get().$ref().child('list'));
    users.$loaded(() => {

      const currentGame = UserStatus.firebase.scoreGame;

      _.each(users, user => user.points = user.wins = user.losses = 0);

      _.each(_.filter(tournaments, t => t.game === currentGame && t.status === TournamentStatus.COMPLETED), tournament => {
        _.each(tournament.matches, match => {
          if(_.any(match.p, id => id === -1)) return; // skip hidden matches

          const result = _.findWhere(tournament.trn, { id: match.id });
          if(!result) return;
          _.each(match.p, (id, idx) => {
            const player = tournament.players[id-1];
            const ref = users.$getRecord(player.id);
            const winScore = _.max(result.score);
            const playerScore = result.score[idx];

            const key = playerScore === winScore ? 'wins' : 'losses';
            if(!ref[key]) ref[key] = 0;
            ref[key]++;
          });
        });
      });

      ScoringFunctions[UserStatus.firebase.scoreFunc](users);

      _.each(users, p => {
        users.$save(p);
      });
    });
  };

  const anyCompletedTournaments = () => _.any(tournaments, t => t.status === TournamentStatus.COMPLETED);
  const allCompletedTournamentGames = () => _(tournaments).filter(t => t.game && t.status === TournamentStatus.COMPLETED).pluck('game').uniq().value();

  return {
    recalculateScore,
    anyCompletedTournaments,
    allCompletedTournamentGames
  };
});