import 'angular';
import 'angular-ui-router';
import 'angular-material';
import 'angular-material-icons';
import 'angular-material-data-table';
import 'ngstorage';
import 'angularfire';

import './services/wrappedFirebase';
import './services/userStatus';
import './services/ensureLoggedIn';
import './services/sidebarManagement';

import './controllers/rootCtrl';
import './controllers/navCtrl';
import './controllers/homeCtrl';
import './controllers/userManageCtrl';
import './controllers/tournamentCtrl';
import './controllers/tournamentSidebarCtrl';

import './routes';