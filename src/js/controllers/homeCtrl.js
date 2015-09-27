import site from '../app';

site.controller('homeController', ($scope, SidebarManagement) => {
  SidebarManagement.hasSidebar = false;

  $scope.blocks = [
    {
      name: 'Tournament Management',
      info: 'Generate single or double elimination brackets with ease.',
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
      info: 'You can use OpenChallenge without an internet connection. When you get a signal, OpenChallenge will save the data automatically.',
      icon: 'desktop_windows'
    },
    {
      name: 'Collaboration',
      info: 'Working with a group? Let them have access to your player catalog.',
      icon: 'group'
    },
    {
      name: 'Distribution',
      info: 'OpenChallenge can export to PDF for easy paper distribution.',
      icon: 'file_download'
    }
  ];
});