import site from '../app';

site.filter('rawHtml', ($sce) => {
  return (value) => $sce.trustAsHtml(value);
});
