import site from '../../app';

site.filter('inRound', () => (items, round) => _.filter(items, (i) => i.id.r === round));
site.filter('inSection', () => (items, section) => _.filter(items, (i) => i.id.s === section));

site.controller('inProgressController', ($scope, $timeout, EnsureLoggedIn, SidebarManagement, TournamentInformation, Toaster, CurrentUsers, CurrentPlayerBucket, UserStatus, TournamentStatus, FirebaseURL, $firebaseObject, $state, $stateParams, $mdDialog) => {

  SidebarManagement.hasSidebar = false;
  const authData = EnsureLoggedIn.check(false);

  const clipboard = new Clipboard('.copy-url');
  clipboard.on('success', () => Toaster.show(`Copied URL to clipboard!`));

  const defaultHasAccess = () => authData && authData.uid === UserStatus.firebase.playerSetUid;

  $scope.hasAccess = defaultHasAccess();

  if(authData) {
    CurrentUsers.watch.then(null, null, currentUsersInfo => {
      const data = currentUsersInfo.users;
      if(!data.shareIDs) return;
      $scope.hasAccess = defaultHasAccess() || data && data.shareIDs[authData.uid];
    });
  }

  $timeout(() => $scope.url = window.location.href, 0);
  $scope.includedTemplate = 'duel';

  $scope.doOrOpen = (event) => $scope.isOpen && $scope.trn.isDone() ? $scope.showResults(event) : $scope.isOpen = true;

  $scope.share = (service) => {
    const services = {
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=',
      twitter: 'https://twitter.com/home?status=',
      google: 'https://plus.google.com/share?url='
    };

    window.open(services[service]+$scope.url, '_blank');
  };

  const determineTemplate = (options) => {
    const hash = { singles: 'duel', doubles: 'duel', groupstage: 'groupstage', ffa: 'ffa', masters: 'masters' };
    if(!options.type && options.last) return 'duel';
    return hash[options.type];
  };

  const determineTournament = (options) => {
    const hash = { singles: Duel, doubles: Duel, groupstage: GroupStage, ffa: FFA , masters: Masters };
    if(!options.type && options.last) return Duel;
    return hash[options.type];
  };

  $scope.showResults = (event) => {
    const mdDialogOptions = {
      clickOutsideToClose: true,
      controller: 'resultsDialogController',
      focusOnOpen: false,
      templateUrl: '/dialog/results',
      event,
      locals: {
        tournamentName: $scope.tournamentName,
        results: $scope.trn.results(),
        players: $scope.bucket
      }
    };

    $mdDialog.show(mdDialogOptions);
  };

  $scope.loadTournament = (ref, makeNew = false) => {
    $scope.tournamentName = $scope.ref.name;
    $scope.includedTemplate = determineTemplate(ref.options);

    $scope.bucket = ref.players;

    const oldScores = _.cloneDeep(ref.trn);
    const tournamentProto = determineTournament(ref.options);

    $scope.trn = ref.trn && !makeNew ? tournamentProto.restore($scope.bucket.length, ref.options, ref.trn) : new tournamentProto($scope.bucket.length, ref.options);

    if(ref.trn && !makeNew) {
      _.each(oldScores, match => {
        const existingMatch = _.findWhere($scope.trn.matches, { id: match.id });
        if(!existingMatch) return;
        existingMatch.score = _.clone(match.score);
      });
    }
  };

  $scope.strings = [];
  $scope.getString = (matchId, idx = 0) => {
    const obj = _.findWhere($scope.strings, { id: matchId });
    if(!obj) return 'TBD';
    return obj.strings[idx];
  };

  $scope.getMatchIdString = TournamentInformation.getMatchIdString;
  $scope.getMatchStationIdString = TournamentInformation.getMatchStationIdString;
  $scope.noRender = TournamentInformation.noRender;

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
      $scope.save();
    });
  };

  $scope.toPDF = () => {
    const pdf = new jsPDF();
    pdf.fromHTML($('.duel-area').get(0), 15, 15);
  };

  $scope.savePublicity = () => {
    $scope.ref.$save();
  };

  $scope.changeOptions = () => {
    $state.go('setupTournament', { tournamentId: $scope.ref.$id });
  };

  $scope.ref.$watch(() => $scope.loadTournament($scope.ref));

  $scope.ref.$loaded().then(() => {
    $scope.loadTournament($scope.ref);

    const horizMatches = _.max($scope.trn.matches, 'id.r').id.r; // these start at 1 I guess.
    const totalSections = _.max($scope.trn.matches, 'id.s').id.s; // get the highest section

    TournamentInformation.reset({ totalSections });

    $scope.maxMatches = new Array(horizMatches);
    $scope.nextMatch = (match) => $scope.trn.right(match);

    $scope.matchesLeft = () => _.reduce($scope.trn.matches, ((prev, m) => prev + ($scope.noRender(m) ? 0 : ~~!m.m)), 0);

    $scope.getIdForMatch = TournamentInformation.getIdForMatch;

    $scope.getName = (idx) => {
      const user = $scope.bucket[idx];
      if(!user) return;
      if(user.alias) return user.alias;
      return user.name;
    };

    $scope.invalidMatch = (match) => !$scope.trn.isPlayable(match);
    $scope.scoresEqual = (match) => {
      if(match.score && match.score.length === 1 || _.filter(match.score, _.isNumber).length !== match.p.length) return true;
      const sorted = _.sortBy(match.score).reverse();
      return sorted[0] === sorted[1];
    };

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

    if(!_.contains(['groupstage', 'ffa', 'masters'], $scope.includedTemplate)) {
      $timeout(() => $scope.strings = TournamentInformation.loadTournamentWinnerStrings($scope.trn), 0);
    }
  });

});