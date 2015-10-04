import site from '../../app';

site.service('CurrentPlayerBucket', ($q, $localStorage) => {

  let bucket = $localStorage.bucket || [];
  const defer = $q.defer();

  return {
    add: (newMembers = []) => {
      bucket.push(...newMembers);
      bucket = _.uniq(bucket, '$id');
      $localStorage.bucket = bucket;
      defer.notify(bucket);
    },
    remove: (person) => {
      bucket = _.without(bucket, person);
      $localStorage.bucket = bucket;
      defer.notify(bucket);
    },
    get: () => bucket,
    clear: () => {
      bucket.length = 0;
      $localStorage.bucket = bucket;
      defer.notify(bucket);
    },
    watch: defer.promise
  };
});