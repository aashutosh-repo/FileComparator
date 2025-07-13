// const { contextBridge, ipcRenderer } = require('electron');

// contextBridge.exposeInMainWorld('electronAPI', {
//   selectFile: () => ipcRenderer.invoke('select-file'),
//   selectFile2: () => ipcRenderer.invoke('select-file2'),
//   saveFile: (filePath, content) => ipcRenderer.invoke('save-file', filePath, content),
// });


   
// console.log('Preload script loaded');

// contextBridge.exposeInMainWorld('electronAPI', {
//   selectFile: () => {
//     console.log('selectFile called');
//     return ipcRenderer.invoke('select-file');
//   },
//   selectFile2: () => {
//     console.log('selectFile2 called');
//     return ipcRenderer.invoke('select-file2');
//   },
//   saveFile: (filePath, content) => {
//     console.log('saveFile called');
//     return ipcRenderer.invoke('save-file', filePath, content);
//   },
// });
