import site from '../app';

site.service('placeService', () => {

  return {
    getPlaceString: (numberPlace) => {
      const postStrings = ['th', 'st', 'nd', 'rd'];
      const baseNumber = numberPlace % 100;
      return numberPlace + (postStrings[(baseNumber - 20) % 10] || postStrings[baseNumber] || postStrings[0]);
    }
  };
});
