import site from '../../app';

site.filter('inRound', () => (items, round) => _.filter(items, (i) => i.id.r === round));
site.filter('inSection', () => (items, section) => _.filter(items, (i) => i.id.s === section));

site.controller('inProgressController', ($scope, SidebarManagement, CurrentPlayerBucket, UserStatus, TournamentStatus, FirebaseURL, $firebaseObject, $state, $stateParams, $mdDialog) => {

  SidebarManagement.hasSidebar = false;

  $scope.url = window.location.href;

  $scope.toCharacter = (round) => {
    let str = '';
    while(round > 0) {
      const modulo = (round-1)%26;
      str = String.fromCharCode(65+modulo) + str;
      round = Math.round((round - modulo) / 26);
    }
    return str;
  };

  $scope.loadTournament = (ref, makeNew = false) => {
    $scope.bucket = ref.players;

    const oldScores = _.cloneDeep(ref.trn);

    $scope.trn = ref.trn && !makeNew ? Duel.restore($scope.bucket.length, ref.options, ref.trn) : new Duel($scope.bucket.length, ref.options);

    if(ref.trn && !makeNew) {
      _.each(oldScores, match => {
        const existingMatch = _.findWhere($scope.trn.matches, { id: match.id });
        if(!existingMatch) return;
        existingMatch.score = _.clone(match.score);
      });
    }
  };

  $scope.ref = $firebaseObject(new Firebase(`${FirebaseURL}/users/${atob($stateParams.userId)}/players/${$stateParams.setId}/tournaments/${$stateParams.tournamentId}`));

  $scope.reset = (ev) => {
    const confirm = $mdDialog.confirm()
      .title('Reset Bracket')
      .content('Would you like to reset this bracket? This is a permanent, irreversible action.')
      .targetEvent(ev)
      .ok('Yes')
      .cancel('No');
    $mdDialog.show(confirm).then(() => {
      $scope.loadTournament($scope.ref, true);
      $scope.ref.$save();
    });
  };

  $scope.toPDF = () => {
    const pdf = new jsPDF();
    pdf.fromHTML($('.duel-area').get(0), 15, 15);
  };

  $scope.savePublicity = () => {
    $scope.ref.$save();
  };

  $scope.ref.$watch(() => $scope.loadTournament($scope.ref));

  $scope.ref.$loaded().then(() => {
    $scope.tournamentName = $scope.ref.name;

    $scope.loadTournament($scope.ref);

    const horizMatches = _.max($scope.trn.matches, 'id.r').id.r; // these start at 1 I guess.
    const totalSections = _.max($scope.trn.matches, 'id.s').id.s; // get the highest section

    $scope.maxMatches = new Array(horizMatches);
    $scope.numMatchesPerSection = _.map(new Array(totalSections), () => 0);
    $scope.nextMatch = $scope.trn.right;

    $scope.matchesLeft = () => _.reduce($scope.trn.matches, ((prev, m) => prev + ($scope.noRender(m) ? 0 : ~~!m.m)), 0);

    const idMap = {};

    $scope.getIdForMatch = (id) => {
      const strId = JSON.stringify(id);
      if(idMap[strId]) return idMap[strId];
      return idMap[strId] = ++$scope.numMatchesPerSection[id.s-1];
    };

    $scope.getName = (idx) => {
      const user = $scope.bucket[idx];
      if(!user) return '-';
      if(user.alias) return user.alias;
      return user.name;
    };

    $scope.invalidMatch = (match) => !$scope.trn.isPlayable(match);
    $scope.noRender = (match) => _.any(match.p, p => p === -1);
    $scope.scoresEqual = (match) => match.score && match.score.length > 1 ? match.score.length !== _.compact(_.uniq(match.score)).length : true;
    $scope.confirmScore = (match) => {
      $scope.trn.score(match.id, _.map(match.score, i => +i));
      $scope.save();
    };

    $scope.save = () => {
      $scope.ref.trn = $scope.trn.state;
      $scope.ref.matches = $scope.trn.matches;
      if($scope.trn.isDone()) $scope.ref.status = TournamentStatus.COMPLETED;
      $scope.ref.$save();
    };
  });

});