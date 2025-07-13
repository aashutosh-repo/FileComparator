// const { app, BrowserWindow, dialog, ipcMain } = require('electron');
// const path = require('path');
// const fsPromises = require('fs/promises');

// function createWindow() {
//   const win = new BrowserWindow({
//     width: 1200,
//     height: 800,
//     webPreferences: {
//       preload: path.join(__dirname, 'preload.js'),
      
//       contextIsolation: true,
//       nodeIntegration: false
//     },
//   });
//   win.loadURL('http://localhost:4200');
// }

// app.whenReady().then(() => {
//   createWindow();

//   app.on('activate', () => {
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// ipcMain.handle('select-file', async () => {
//   const result = await dialog.showOpenDialog({ properties: ['openFile'] });
//   if (!result.canceled && result.filePaths.length > 0) {
//     const filePath = result.filePaths[0];
//     const content = await fsPromises.readFile(filePath, 'utf8');
//     return { path: filePath, content };
//   }
//   return null;
// });

// ipcMain.handle('select-file2', async () => {
//   const result = await dialog.showOpenDialog({ properties: ['openFile'] });
//   if (!result.canceled && result.filePaths.length > 0) {
//     const filePath = result.filePaths[0];
//     const content = await fsPromises.readFile(filePath, 'utf8');
//     return { path: filePath, content };
//   }
//   return null;
// });

// ipcMain.handle('save-file', async (event, filePath, content) => {
//   try {
//     console.log('📝 Attempting to write file at:', filePath);
//     console.log('📝 Content:', content);
//     console.log('🧠 fs.writeFile type:', fs.writeFile.toString());

//     await fs.writeFile(filePath, content, { encoding: 'utf-8' });
//     return { success: true };
//   } catch (err) {
//     console.error('❌ Write failed:', err);
//     return { success: false, error: err.message };
//   }
// });

// app.on('window-all-closed', () => {
//   if (process.platform !== 'darwin') app.quit();
// });
