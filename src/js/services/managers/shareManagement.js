import site from '../../app';

site.service('ShareManagement', (UserStatus, FirebaseURL, $firebaseArray) => {

  const me = UserStatus.authData.uid;

  const manageSorting = (oldSortsPlucked, newSorts, docId) => {
    const newSortsPlucked = _.pluck(newSorts, 'uid');
    const removals = _.difference(oldSortsPlucked, newSortsPlucked);
    const additions = _.difference(newSortsPlucked, oldSortsPlucked);

    if(removals.length === 0 && additions.length === 0) return;

    _.each(additions, add => {
      const sharebase = $firebaseArray(new Firebase(`${FirebaseURL}/shares/${add}/${me}`));
      sharebase.$loaded().then(() => {
        sharebase.$add(docId);
      });
    });

    _.each(removals, rem => {
      const sharebase = $firebaseArray(new Firebase(`${FirebaseURL}/shares/${rem}/${me}`));
      sharebase.$loaded().then(() => {
        const item = _.findWhere(sharebase, { $value: docId });
        sharebase.$remove(sharebase.$indexFor(item.$id));
      });
    });
  };

  return {
    manageSorting
  };

});