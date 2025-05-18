const { app, BrowserWindow } = require('electron');
const path = require('node:path');
const http = require('http');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const isDev = !app.isPackaged;

async function waitForServer(url, timeout = 10000) {
  const start = Date.now();

  return new Promise((resolve, reject) => {
    const check = () => {
      http.get(url, () => {
        resolve();
      }).on('error', () => {
        if (Date.now() - start > timeout) {
          reject(new Error('Timed out waiting for server'));
        } else {
          setTimeout(check, 300);
        }
      });
    };
    check();
  });
}

const createWindow = async () => {
  const mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Adjust if needed
      contextIsolation: true,
    },
    icon: path.join(__dirname, 'assets/LPRMonitor_Icon.ico'),
    autoHideMenuBar: true,
  });

  // Content Security Policy override
  mainWindow.webContents.session.webRequest.onHeadersReceived((details, callback) => {
    callback({
      responseHeaders: {
        ...details.responseHeaders,
        'Content-Security-Policy': [
          "default-src 'self' data: blob: 'unsafe-inline' 'unsafe-eval'; " +
          "img-src 'self' data: https: http: blob:; " +
          "media-src 'self' data: https: http: blob:; " +
          "connect-src 'self' http://localhost:5000 ws://localhost:3000 http://192.168.0.173:8080;"
        ],
      },
    });
  });
  

  if (isDev) {
    try {
      await waitForServer('http://localhost:5173');
      await mainWindow.loadURL('http://localhost:5173'); // Vite dev server
      mainWindow.webContents.openDevTools();
    } catch (e) {
      console.error('Failed to load dev server:', e);
      app.quit();
    }
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html')); // Built app
  }
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
