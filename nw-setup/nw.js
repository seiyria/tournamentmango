var express = require('express');
var expressApp = express();

expressApp.use(express.static(__dirname));
expressApp.listen(30517);