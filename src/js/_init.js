
import './constants/firebaseURL';
import './constants/tournamentStatus';

import './services/userStatus';
import './services/ensureLoggedIn';
import './services/managers/sidebarManagement';
import './services/disconnectNotifier';
import './services/toaster';
import './services/filterUtils';
import './services/auth';

import './services/currents/currentEvents';
import './services/currents/currentTournaments';

import './services/managers/userManagement';
import './services/managers/eventManagement';
import './services/managers/tournamentManagement';
import './services/managers/setManagement';

import './services/prompts/inputPrompt';
import './services/prompts/selectPrompt';
import './services/prompts/sharePrompt';
import './services/managers/shareManagement';

import './controllers/rootCtrl';
import './controllers/navCtrl';
import './controllers/homeCtrl';
import './controllers/managers/userManageCtrl';
import './controllers/managers/tournamentManageCtrl';
import './controllers/managers/eventManageCtrl';
import './controllers/userSettingsCtrl';
import './controllers/tournamentSidebarCtrl';

import './controllers/dialogs/userDialogCtrl';
import './controllers/dialogs/eventDialogCtrl';
import './controllers/dialogs/tournamentDialogCtrl';
import './controllers/dialogs/inputPromptCtrl';
import './controllers/dialogs/sharePromptCtrl';
import './controllers/dialogs/selectPromptCtrl';

import './routes';