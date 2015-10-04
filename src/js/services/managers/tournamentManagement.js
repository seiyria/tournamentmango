import site from '../../app';

site.service('TournamentManagement', (FirebaseURL, $mdDialog, Toaster, $filter, FilterUtils, CurrentEvents) => {

  const defaultMdDialogOptions = {
    clickOutsideToClose: true,
    controller: 'tournamentDialogController',
    focusOnOpen: false,
    templateUrl: '/dialog/addtournament'
  };

  const addItem = (browserEvent, callback) => {
    const mdDialogOptions = _.clone(defaultMdDialogOptions);
    mdDialogOptions.event = browserEvent;
    mdDialogOptions.locals = { tournament: {} };
    $mdDialog.show(mdDialogOptions).then(callback);
  };

  const editItem = (browserEvent, tournament, callback) => {
    const mdDialogOptions = _.clone(defaultMdDialogOptions);
    mdDialogOptions.event = browserEvent;
    mdDialogOptions.locals = { tournament };
    $mdDialog.show(mdDialogOptions).then(callback);
  };

  const removeItem = (browserEvent, tEvents, callback) => {
    const dialog = $mdDialog.confirm()
      .targetEvent(browserEvent)
      .title('Remove Event')
      .content(`Are you sure you want to remove ${tEvents.length} tournaments?`)
      .ok('OK')
      .cancel('Cancel');

    $mdDialog.show(dialog).then(() => {
      Toaster.show(`Successfully removed ${tEvents.length} tournaments.`);
      callback();
    });
  };

  const archiveItem = (browserEvent, tEvents, callback) => {
    const string = _.any(tEvents, 'archived') ? 'unarchived' : 'archived';
    Toaster.show(`Successfully ${string} ${tEvents.length} tournaments.`);
    callback();
  };

  const getTournamentNameFromId = (id) => _.findWhere(CurrentEvents.get(), { $id: id }).name;

  const filterTournaments = (events, datatable, archived = false) => {
    const func = archived ? 'filter' : 'reject';
    return _[func](FilterUtils.filterTable(events, datatable, tournament => [
      [tournament.name.toLowerCase()],
      [tournament.game.toLowerCase()],
      [tournament.status.toLowerCase()],
      [getTournamentNameFromId(tournament.event).toLowerCase()]
    ]), 'archived');
  };

  return {
    addItem,
    editItem,
    removeItem,
    archiveItem,
    filterTournaments,
    getTournamentNameFromId
  };
});