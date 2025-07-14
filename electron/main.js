const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');
const fsPromises = require('fs');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  win.loadURL('http://localhost:4200');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

ipcMain.handle('select-file', async () => {
  const result = await dialog.showOpenDialog({ properties: ['openFile'],
      filters: [
        {
          name: 'Supported Files',
          extensions: ['txt', 'java', 'py', 'csv', 'json', 'xml', 'html', 'css', 'js', 'ts', 'md'],
        },
      ],
    });
  
  if (!result.canceled && result.filePaths.length > 0) {
    const filePath = result.filePaths[0];
    const content = fsPromises.readFileSync(filePath, 'utf8');
    return { path: filePath, content };
  }
  return null;
});

ipcMain.handle('save-file', async (event, filePath, content) => {
  try {
    const { writeFile } = await import('fs/promises'); // ✅ guaranteed correct
        await writeFile(filePath, content, { encoding: 'utf-8' });
        console.log('🧪 writeFile.toString:', writeFile.toString());


    // await fsPromises.writeFile(filePath, content, { encoding: 'utf-8' });
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
