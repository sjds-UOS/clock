const {app, BrowserWindow, Menu, ipcMain} = require("electron")

let settingWindow = null


function make() {

  if (settingWindow === null) {
    createWindow()
  } else {
    // if (settingWindow.isVisible()) {
    //   settingWindow.hide()
    // } else {
    //   settingWindow.show()
    // }
    settingWindow.close()
  }
  function createWindow(mainWindow) {
    
    settingWindow = new BrowserWindow({
      // width:500,
      // height: 375,
      width: 360,
      height: 325,
      modal: true,
      parent: mainWindow,
      alwaysOnTop: true,
      // resizable: false,
      // backgroundColor: '#00000000',
      transparent:true,
      show: false,
      frame:false,
    });

    settingWindow.loadURL('file://'+ __dirname +'/app/setting.html');
    
    // settingWindow.webContents.openDevTools();

    settingWindow.once("ready-to-show", function() {
      settingWindow.show()
    })
    settingWindow.on('closed', () => {
      settingWindow = null;
    });
  }
}



module.exports = make