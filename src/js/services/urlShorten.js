import site from '../app';

site.service('UrlShorten', ($http) => {

  // this only works on tournamentmango.com
  const API_KEY = 'AIzaSyCV-22gDbdaQjP2oAII3ODLvj8pgSmaAKE';
  const url = 'https://www.googleapis.com/urlshortener/v1/url';
  const apiUrl = `${url}/?key=${API_KEY}`;

  return {
    shorten: (url) => {
      return $http.post(apiUrl, { longUrl: url });
    }
  };
});