const electron = require('electron');
const { is } = require('electron-util');

const { app } = electron;

function loadRoute(window, route) {
  let url;

  if (is.development) {
    url = `http://localhost:8080/#/${route}`;
  } else {
    url = `file:///${app.getAppPath()}/dist/index.html#${route}`;
  }

  window.loadURL(url);
}

// Prevent window being garbage collected
let mainWindow;

function createMainWindow() {
  mainWindow = new electron.BrowserWindow({
    width: 600,
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  loadRoute(mainWindow, '');
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', () => {
  createMainWindow();
});
