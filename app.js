/*
* This file manages the application life cycle. It creates the browser windows
* and kills the application when all the windows have been closed.
*
* Created by Fernando Rodríguez Sánchez, 2016
*/

const electron = require('electron');
const {app, BrowserWindow, Menu} = require('electron');
const fs = require('fs');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow;
let application_menu;

function createMainWindow(){

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/views/main.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

function createApplicationMenu() {
  let application_menu = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Open Bayesian network',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            electron.dialog.showOpenDialog({ 
              title: 'Open a stored Bayesian network',
              filters: [{ name: 'text', extensions: ['json'] }],
              properties: ['openFile', 'createDirectory']
            }, 
            function (fileNames) {
              if (fileNames === undefined) return;
              let fileName = fileNames[0];
              fs.readFile(fileName, 'utf-8', function (err, data) {
                //document.getElementById("editor").value = data;
                console.log(data);
              });
            }); 
          }
        },
        {
          label: 'Save Bayesian network',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            electron.dialog.showOpenDialog({ 
              title: 'Open a stored Bayesian network',
              filters: [{ name: 'text', extensions: ['json'] }],
              properties: ['openFile', 'createDirectory']
            }, 
            function (fileNames) {
              if (fileNames === undefined) return;
              let fileName = fileNames[0];
              fs.readFile(fileName, 'utf-8', function (err, data) {
                //document.getElementById("editor").value = data;
                console.log(data);
              });
            }); 
          }
        }
      ]
    },
    {
      label: 'Debug',
      submenu: [
        {
          label: 'Open Dev Tools',
          accelerator: 'CmdOrCtrl+A',
          click: () => {
            mainWindow.openDevTools();
          }
        }
      ]
    },
    {
      label: 'About',
      submenu: [
        {
          label: 'About',
          click: () => {
            electron.dialog.showMessageBox({
              type: 'info',
              title: 'About the software',
              message: "This software has been developed by Fernando Rodríguez Sánchez \ Hola",
              buttons: ['Ok']
            });
          }
        }
      ]
    }
  ];

  return application_menu;
}


// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform != 'darwin')
    app.quit();
});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

  createMainWindow();

  application_menu = createApplicationMenu();

  menu = Menu.buildFromTemplate(application_menu);
  Menu.setApplicationMenu(menu);

});
