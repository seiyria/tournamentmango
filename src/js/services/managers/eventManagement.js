import site from '../../app';

site.service('EventManagement', (FirebaseURL, $mdDialog, Toaster, $filter, FilterUtils) => {

  const defaultMdDialogOptions = {
    clickOutsideToClose: true,
    controller: 'eventDialogController',
    focusOnOpen: false,
    templateUrl: '/dialog/addevent'
  };

  const addItem = (browserEvent, callback) => {
    const mdDialogOptions = _.clone(defaultMdDialogOptions);
    mdDialogOptions.event = browserEvent;
    mdDialogOptions.locals = { tEvent: {} };
    $mdDialog.show(mdDialogOptions).then(callback);
  };

  const editItem = (browserEvent, tEvent, callback) => {
    const mdDialogOptions = _.clone(defaultMdDialogOptions);
    mdDialogOptions.event = browserEvent;
    mdDialogOptions.locals = { tEvent };
    $mdDialog.show(mdDialogOptions).then(callback);
  };

  const removeItem = (browserEvent, tEvents, callback) => {
    const dialog = $mdDialog.confirm()
      .targetEvent(browserEvent)
      .title('Remove Event')
      .content(`Are you sure you want to remove ${tEvents.length} events?`)
      .ok('OK')
      .cancel('Cancel');

    $mdDialog.show(dialog).then(() => {
      Toaster.show(`Successfully removed ${tEvents.length} events.`);
      callback();
    });
  };

  const archiveItem = (browserEvent, tEvents, callback) => {
    const string = _.any(tEvents, 'archived') ? 'unarchived' : 'archived';
    Toaster.show(`Successfully ${string} ${tEvents.length} events.`);
    callback();
  };

  const filterEvents = (events, datatable, archived = false) => {
    const func = archived ? 'filter' : 'reject';
    return _[func](FilterUtils.filterTable(events, datatable, event => [
      [event.name.toLowerCase()],
      [(event.description || '').toLowerCase()],
      [event.location.toLowerCase()],
      [$filter('date')(event.date, 'fullDate').toLowerCase()]
    ]), 'archived');
  };

  return {
    addItem,
    editItem,
    removeItem,
    archiveItem,
    filterEvents
  };
});