import site from '../app';

site.service('FilterUtils', () => {

  const filterByContains = (array, contains) => _.filter(array, (str) => _.contains(str.toLowerCase(), contains.toLowerCase()));
  const getUniqueKeys = (array, key) => _.compact(_.uniq(_.flatten([_.pluck(array, key)], true)));
  const getAndFilter = (array, key, search = '') => filterByContains(getUniqueKeys(array, key), search);

  // get a filter array for user if they exist
  const getFilterArr = (user, arr) => user[arr] ? _.map(user[arr], (s) => s.toLowerCase()) : [];

  // check if anything in the right is a substring in the left
  const containsAny = (left, right) => _.some(right, (filterKey) => _.some(left, (string) => _.contains(string, filterKey)));

  const filterTable = (array, datatable, criterion = () => []) => {

    // allow multiple filters separated by a comma
    const filterArr = _.compact(_.map(datatable.filter.toLowerCase().split(','), (m) => m.trim()));

    // pagination and stuff
    const startIndex = datatable.limit * (datatable.page-1);
    const endIndex = startIndex + datatable.limit;
    const doReverse = datatable.order.charAt(0) === '-';
    let order = datatable.order;

    if(doReverse) {
      order = order.substring(1);
    }

    const filtered = _(array)
      .filter(user => {

        // only show people that match all criteria
        return filterArr.length === 0 ? true : _.reduce(
          _.map(criterion(user), (criteria) => containsAny(criteria, filterArr)),
          (prev, cur) => prev + ~~cur,
          0
        ) >= filterArr.length;
      })
      .sortByOrder([order], [doReverse ? 'asc' : 'desc'])
      .slice(startIndex, endIndex)
      .value();

    return filtered;
  };

  return {
    containsAny,
    getFilterArr,
    getUniqueKeys,
    getAndFilter,
    filterByContains,
    filterTable
  };
});