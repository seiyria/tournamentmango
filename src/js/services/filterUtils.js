import site from '../app';

site.service('FilterUtils', () => {

  const filterByContains = (array, contains) => _.filter(array, (str) => _.contains(str.toLowerCase(), contains.toLowerCase()));
  const getUniqueKeys = (array, key) => _.uniq(_.pluck(array, key));

  return {
    getUniqueKeys,
    filterByContains
  };
});