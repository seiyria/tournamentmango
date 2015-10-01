import site from '../../app';

site.service('SetManagement', (FirebaseURL, $mdDialog, InputPrompt, SelectPrompt, SharePrompt, Toaster) => {

  const newSet = (event, invalidValues, callback) => {
    InputPrompt.show(event, {
      title: 'Add new player set',
      label: 'Player set name',
      invalidValues
    }, (string) => {
      Toaster.show(`Successfully added new player set "${string}"`);
      callback(string);
    });
  };

  const renameSet = (event, defaultName, callback) => {
    InputPrompt.show(event, {
      defaultValue: defaultName,
      title: 'Rename this player set',
      label: 'Player set name'
    }, (string) => {
      Toaster.show(`Successfully renamed player set to "${string}"`);
      callback(string);
    });
  };

  const changeSet = (event, current, choices, callback) => {
    SelectPrompt.show(event, {
      defaultValue: current,
      selectableValues: choices,
      title: 'Choose a player set',
      label: 'Player set'
    }, (string) => {
      Toaster.show(`Successfully changed player set to "${string}"`);
      callback(string);
    });
  };

  const deleteSet = (event, callback) => {
    const dialog = $mdDialog.confirm()
      .targetEvent(event)
      .title('Remove Player')
      .content(`Are you sure you want to remove this player set?`)
      .ok('OK')
      .cancel('Cancel');

    $mdDialog.show(dialog).then(() => {
      Toaster.show(`Successfully removed player set.`);
      callback();
    });
  };

  const shareSet = (event, docName, defaultShared, callback) => {
    SharePrompt.show(event, {
      title: docName,
      defaultValue: defaultShared || []
    }, (data) => {
      Toaster.show(`Successfully updated share settings`);
      callback(data);
    });
  };

  return {
    newSet,
    renameSet,
    deleteSet,
    shareSet,
    changeSet
  };
});