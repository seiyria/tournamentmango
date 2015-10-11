var path = require('path');
var app = require('app');  // Module to control application life.
var BrowserWindow = require('browser-window');  // Module to create native browser window.

var express = require('express');
var expressApp = express();

expressApp.use(express.static(path.join(__dirname, '/dist')));
expressApp.listen(30517);

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
var mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  app.quit();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {
  // Create the browser window.
  mainWindow = new BrowserWindow({ width: 1024, height: 768, center: true });

  // and load the index.html of the app.
  //mainWindow.loadUrl('file://' + __dirname + '/index.html');
  mainWindow.loadUrl('http://localhost:30517');

  mainWindow.openDevTools();

});