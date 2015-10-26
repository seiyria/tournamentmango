import site from '../app';

site.controller('homeController', ($scope, SidebarManagement) => {
  SidebarManagement.hasSidebar = false;

  $scope.blocks = [
    {
      name: 'Tournament Management',
      info: 'Generate single elimination, double elimination, free-for-all, round robin, or masters brackets with ease.',
      icon: 'assignment'
    },
    {
      name: 'Player Catalog',
      info: 'Keep track of all the important info - wins, losses, names, aliases, and more.',
      icon: 'accessibility'
    },
    {
      name: 'Broadcasting',
      info: 'When you\'re online, share any or all of your tournament brackets with the world.',
      icon: 'settings_input_antenna'
    },
    {
      name: 'Offline Capability',
      info: 'You can use TournamentMango without an internet connection. When you get a signal, TournamentMango will save the data automatically.',
      icon: 'desktop_windows'
    },
    {
      name: 'Collaboration',
      info: 'Working with a group? Let them have access to your player catalog.',
      icon: 'group'
    },
    {
      name: 'Open Source',
      link: 'https://github.com/seiyria/openchallenge',
      info: 'No secrets here. Check out the source on GitHub by clicking the icon above. Feel free to open an issue if you have problems, or submit a pull request if you\'re inclined.',
      icon: 'github-circle'
    }
  ];
});