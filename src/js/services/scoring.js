import site from '../app';

site.service('ScoringFunctions', (CurrentTournaments, TournamentStatus) => {

  return {

    // Wins - Losses
    simple: (players) => {
      _.each(players, player => {
        player.points = player.wins - player.losses;
      });
    },

    // (400 * (wins - losses) + x) / y
    // x = total score of all opponents in every match ever
    // y = total number of opponents in every match ever
    ell: (players) => {
      const tempScores = {};
      _.each(players, player => {
        tempScores[player.$id] = 400 * (player.wins - player.losses);
      });

      _.each(_.filter(CurrentTournaments.get(), t => t.status === TournamentStatus.COMPLETED), tournament => {
        _.each(tournament.matches, match => {
          if(_.any(match.p, p => p === -1)) return; // ignore walkover matches
          _.each(match.p, p => {
            const currentPlayer = tournament.players[p-1];
            if(!currentPlayer) return;
            const otherPlayersScore = _(match.p)
              .without(p)
              .map(p => tempScores[tournament.players[p-1].id])
              .value();

            const fbPlayerObj = players.$getRecord(currentPlayer.id);
            fbPlayerObj.points += (_.reduce(otherPlayersScore, (prev, x) => prev + x, 0) / otherPlayersScore.length);
          });
        });
      });
    }
  };
});