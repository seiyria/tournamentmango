import site from '../app';

site.service('UserManagement', (FirebaseURL, $mdDialog, Toaster) => {

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

    // allow multiple filters separated by a comma
    const filter = _.compact(_.map(datatable.filter.toLowerCase().split(','), (m) => m.trim()));

    // check if anything in the right is a substring in the left
    const containsAny = (left, right) => _.some(right, (filterKey) => _.some(left, (string) => _.contains(string, filterKey)));

    // get a filter array for user if they exist
    const filterArr = (user, arr) => user[arr] ? _.map(user[arr], (s) => s.toLowerCase()) : [];

    // pagination and stuff
    const startIndex = datatable.limit * (datatable.page-1);
    const endIndex = startIndex + datatable.limit;
    const doReverse = datatable.order.charAt(0) === '-';
    let order = datatable.order;

    if(doReverse) {
      order = order.substring(1);
    }

    return _(users)
      .filter(user => {

        // only show people that match all criteria
        return filter.length === 0 ? true : _.reduce(
          [
            containsAny([user.name.toLowerCase()], filter),
            containsAny([user.location.toLowerCase()], filter),
            containsAny(filterArr(user, 'aliases'), filter),
            containsAny(filterArr(user, 'games'), filter),
            containsAny(filterArr(user, 'characters'), filter)
          ],
          (prev, cur) => prev + ~~cur,
          0
        ) >= filter.length;
      })
      .sortByOrder([order], [doReverse ? 'asc' : 'desc'])
      .slice(startIndex, endIndex)
      .value();
  };

  return {
    addItem,
    editItem,
    removeItem,
    viewItem,
    filterUsers
  };
});