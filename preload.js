// File: preload.js
const { contextBridge, ipcRenderer } = require('electron');

// Make sure this runs correctly by adding a console log
console.log('Preload script is running');

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  saveAudioFile: (buffer) => ipcRenderer.invoke('save-audio-file', buffer)
});

console.log('electronAPI exposed:', typeof window !== 'undefined' && !!window.electronAPI);
