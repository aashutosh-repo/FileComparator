const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  selectFile: () => ipcRenderer.invoke('select-file'),
  saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
  watchFile: (filePath) => ipcRenderer.invoke('watch-file',filePath),
  unwatchFile: (filePath) => ipcRenderer.invoke('unwatch-file',filePath),
  onFileUpdated: (callback) => ipcRenderer.on('file-updated',(event,path) => callback(path))
});
contextBridge.exposeInMainWorld('env', {
  isElectron: true
});