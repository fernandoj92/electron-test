/*
* This file manages the application life cycle. It creates the browser windows
* and kills the application when all the windows have been closed.
*
* Created by Fernando Rodríguez Sánchez, 2016
*/

const electron = require('electron');
const {app, BrowserWindow, Menu} = require('electron');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the javascript object is GCed.
let mainWindow;

function createMainWindow(){

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  mainWindow.loadURL('file://' + __dirname + '/index.html');

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
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo'
        },
        {
          label: 'Open',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            electron.dialog.showOpenDialog({ properties: [ 'openFile', 'openDirectory', 'multiSelections' ]});
          }
        },
        {
          label: 'submenu1',
          submenu: [
            {
              label: 'item1',
              accelerator: 'CmdOrCtrl+A',
              click: () => {
                mainWindow.openDevTools();
              }
            },
            {
              label: 'item2',
              accelerator: 'CmdOrCtrl+B',
              click: () => {
                mainWindow.closeDevTools();
              }
            }
          ]
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

  let application_menu = createApplicationMenu();

  menu = Menu.buildFromTemplate(application_menu);
  Menu.setApplicationMenu(menu);

});
