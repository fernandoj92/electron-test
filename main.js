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
let secondaryWindows = [];

function createMainWindow(){

  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600})

  // and load the index.html of the app.
  //mainWindow.loadURL('file://' + __dirname + '/views/main.html');
  mainWindow.loadURL('file://' + __dirname + '/views/secondWindow/secondWindow.html');

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
              fs.readFile(fileName, 'utf-8', function (err, fileData) {
                try{
                  var jsonContent = JSON.parse(fileData);
                  // Enviamos el contenido a Cytoscape
                  //console.log(jsonContent);
                  function createBnWindow(){
                    let bnWindow = new BrowserWindow({width: 800, height: 600})

                    bnWindow.loadURL('file://' + __dirname + '/views/bnWindow/bnWindow.html');
                    secondaryWindows.push(bnWindow);
                    bnWindow.show();

                    // Emitted when the window is closed.
                    bnWindow.on('closed', function () {
                      // Dereference the window object.
                    bnWindow = null
                    })

                    return bnWindow;
                  }

                  // Creamos la ventana donde se mostrara la red bayesiana
                  let bnWindow = createBnWindow();
                  // Le pasamos mediante el webContents el contenido de la red
                  bnWindow.webContents.on('did-finish-load', () => {
                    bnWindow.webContents.send('load-BN', jsonContent)
                  })
                }catch(e){
                    console.log(e); //There was an error while parsing
                }
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
      label: 'View',
      submenu: [
        {
          label: 'Second Window',
          accelerator: 'CmdOrCtrl+W',
          click: () => {
            createSecondaryWindow();
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

function createSecondaryWindow(){
  // Create the browser window.
  let secondaryWindow = new BrowserWindow({width: 400, height: 400})

  // and load the index.html of the app.
  secondaryWindow.loadURL('file://' + __dirname + '/views/secondWindow/secondWindow.html');

  secondaryWindows.push(secondaryWindow);

  secondaryWindow.show();

  // Emitted when the window is closed.
  secondaryWindow.on('closed', function () {
    // Dereference the window object.
    secondaryWindow = null
  })
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
