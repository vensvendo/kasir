const { app, BrowserWindow } = require('electron');
const path = require('path');

// Import server backend Express (otomatis menjalankan server di port 3000)
require('./backend/server');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Memuat aplikasi melalui server Express lokal agar fetch API dan router tab berjalan sempurna
  mainWindow.loadURL('http://localhost:3000');

  // Opsional: Buka DevTools untuk debugging
  // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  // Beri jeda singkat agar Express server siap menerima koneksi
  setTimeout(() => {
    createWindow();
  }, 500);

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
