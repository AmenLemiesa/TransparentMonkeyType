// main.js
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 400,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
  
  // Optional: Open DevTools for debugging
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Handle opacity changes from renderer
ipcMain.on('set-opacity', (event, opacity) => {
  if (mainWindow) {
    mainWindow.setOpacity(opacity);
  }
});

// Handle window resizing
ipcMain.on('resize-window', (event, data) => {
  if (mainWindow) {
    const [currentX, currentY] = mainWindow.getPosition();
    const currentBounds = mainWindow.getBounds();
    
    if (data.direction === 'left') {
      mainWindow.setBounds({
        x: currentX + data.deltaX,
        y: currentY,
        width: data.width,
        height: currentBounds.height
      });
    } else {
      mainWindow.setSize(data.width, currentBounds.height);
    }
  }
});

// Handle quit app
ipcMain.on('quit-app', () => {
  app.quit();
});