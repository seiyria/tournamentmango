import site from '../../app';

site.controller('eventManageController', ($scope, SidebarManagement, EnsureLoggedIn, EventManagement, CurrentEvents, CurrentTournaments) => {
  SidebarManagement.hasSidebar = true;
  EnsureLoggedIn.check();

  $scope.events = [];
  $scope.visibleEvents = [];
  $scope.selected = [];

  $scope.datatable = {
    filter: '',
    order: '-name',
    limit: 10,
    page: 1,
    bookmark: 1
  };

  $scope.filter = { options: { throttle: 500 } };

  $scope.hideSearch = () => {
    $scope.datatable.filter = '';
    $scope.filter.show = false;
    if($scope.filter.form.$dirty) {
      $scope.filter.form.$setPristine();
    }
  };

  const filterWatch = (newValue, oldValue) => {
    if(!oldValue) {
      $scope.datatable.bookmark = $scope.datatable.page;
    }

    if(newValue !== oldValue) {
      $scope.datatable.page = 1;
    }

    if(!newValue) {
      $scope.datatable.page = $scope.datatable.bookmark;
    }

    $scope.getEvents();
  };

  $scope.$watch('datatable.filter', filterWatch);

  $scope.toggleShowArchived = () => {
    $scope.showArchived = !$scope.showArchived;
    $scope.getEvents();
  };

  $scope.getEvents = () => $scope.visibleEvents = EventManagement.filterEvents($scope.events, $scope.datatable, $scope.showArchived);

  $scope.addItem = (event) => {
    EventManagement.addItem(event, newEvent => {
      $scope.events.$add(newEvent);
    });
  };

  $scope.editItem = (event) => {
    EventManagement.editItem(event, $scope.selected[0], oldEvent => {
      const item = $scope.events.$getRecord(oldEvent.$id);
      _.extend(item, oldEvent);
      $scope.events.$save(item);
    });
  };

  $scope.removeItem = (event) => {
    EventManagement.removeItem(event, $scope.selected, () => {
      const tournaments = CurrentTournaments.get();
      _.each(tournaments, tournament => {
        if(tournament.event === event.$id) {
          const fbTournament = tournaments.$getRecord(tournament.$id);
          fbTournament.event = null;
          tournaments.$save(fbTournament);
        }
      });

      _.each($scope.selected, event => {
        const item = $scope.events.$getRecord(event.$id);
        $scope.events.$remove(item);
      });

      $scope.selected = [];
    });
  };

  $scope.archiveItem = (event) => {
    EventManagement.archiveItem(event, $scope.selected, () => {
      _.each($scope.selected, event => {
        const item = $scope.events.$getRecord(event.$id);
        item.archived = !item.archived;
        $scope.events.$save(item);
      });

      $scope.selected = [];
    });
  };

  $scope.loadEvents = () => {
    $scope.events = CurrentEvents.get();
    $scope.events.$loaded($scope.getEvents);
    $scope.events.$watch($scope.getEvents);
  };

  CurrentEvents.watch.then(null, null, () => {
    $scope.loadEvents();
  });

  $scope.loadEvents();
});