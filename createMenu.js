const {Menu, ipcMain} = require("electron")
function createMenu() {
  const template = [
    {
      label: 'Window',
      submenu: [
        {
          label: 'Minimize',
          accelerator: 'CmdOrCtrl+M',
          role: 'minimize'
        },
        {
          label: 'Close',
          accelerator: 'CmdOrCtrl+W',
          role: 'close'
        },
      ]
    },
    {
      label: global.shareObj.translation.Alarm,
      submenu: [
        {
          label: global.shareObj.translation.Set,
          click() {
            ipcMain.emit("toggle-setting-window")
          }
        }
      ]
    },
    {
      label: global.shareObj.translation.Language,
      submenu: [
        {
          label: "中文",
          type: "radio",
          checked: global.shareObj.translation === "zh-CN",
          click() {
            global.shareObj.translation = require("./translation.js")("zh-CN")
          }
        },
        {
          label: "English",
          type: "radio",
          checked: global.shareObj.translation === "en-US",
          click() {
            global.shareObj.translation = require("./translation.js")("en-US")
          }
        }
      ]
    }
    // {
    //   label: 'Help',
    //   role: 'help',
    //   submenu: [
    //     {
    //       label: 'Learn More',
    //       click() { require('electron').shell.openExternal('https://github.com/hudichao/electron-digital-clock#readme'); }
    //     },
    //   ]
    // },
  ];

  if (process.platform === 'darwin') {
    const name = require('electron').app.getName();
    template.unshift({
      label: name,
      submenu: [
        {
          label: 'About ' + name,
          role: 'about'
        },
        {
          type: 'separator'
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click() { require('electron').app.quit(); }
        },
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}
module.exports = createMenu
