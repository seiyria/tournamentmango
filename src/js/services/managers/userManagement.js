import site from '../../app';

site.service('UserManagement', (FirebaseURL, $mdDialog, Toaster, FilterUtils) => {

  const defaultMdDialogOptions = {
    clickOutsideToClose: true,
    controller: 'userDialogController',
    focusOnOpen: false,
    templateUrl: '/dialog/adduser'
  };

  const addItem = (event, callback) => {
    const mdDialogOptions = _.clone(defaultMdDialogOptions);
    mdDialogOptions.event = event;
    mdDialogOptions.locals = { player: {}, viewOnly: false };
    $mdDialog.show(mdDialogOptions).then(callback);
  };

  const editItem = (event, player, callback) => {
    const mdDialogOptions = _.clone(defaultMdDialogOptions);
    mdDialogOptions.event = event;
    mdDialogOptions.locals = { player, viewOnly: false };
    $mdDialog.show(mdDialogOptions).then(callback);
  };

  const removeItem = (event, players, callback) => {
    const dialog = $mdDialog.confirm()
      .targetEvent(event)
      .title('Remove Player')
      .content(`Are you sure you want to remove ${players.length} players?`)
      .ok('OK')
      .cancel('Cancel');

    $mdDialog.show(dialog).then(() => {
      Toaster.show(`Successfully removed ${players.length} players.`);
      callback();
    });
  };

  const viewItem = (event, player) => {
    event.stopPropagation();
    const mdDialogOptions = _.clone(defaultMdDialogOptions);
    mdDialogOptions.event = event;
    mdDialogOptions.locals = { player, viewOnly: true };
    $mdDialog.show(mdDialogOptions);
  };

  const filterUsers = (users, datatable) => {
    return FilterUtils.filterTable(users, datatable, user => [
      [user.name.toLowerCase()],
      [user.location.toLowerCase()],
      FilterUtils.getFilterArr(user, 'aliases'),
      FilterUtils.getFilterArr(user, 'games'),
      FilterUtils.getFilterArr(user, 'characters')
    ]);
  };

  return {
    addItem,
    editItem,
    removeItem,
    viewItem,
    filterUsers
  };
});