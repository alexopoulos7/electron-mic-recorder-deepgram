const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  mainWindow.loadFile('index.html');
  // Uncomment for debugging
   mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
  createWindow();
  
  // Register IPC handlers
  setupIPCHandlers();
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// Set up all IPC handlers
function setupIPCHandlers() {
  // Handle saving the recorded audio file
  ipcMain.handle('save-audio-file', handleSaveAudioFile);
  console.log('IPC handler registered for save-audio-file');
}

// Handle saving the audio file
async function handleSaveAudioFile(event, buffer) {
  try {
    const { filePath, canceled } = await dialog.showSaveDialog({
      title: 'Save Recording',
      defaultPath: path.join(app.getPath('documents'), 'recording.wav'),
      filters: [{ name: 'WAV Files', extensions: ['wav'] }]
    });
    
    if (canceled || !filePath) return { success: false, message: 'No file selected' };
    
    // Convert the ArrayBuffer to Buffer
    const nodeBuffer = Buffer.from(buffer);
    
    // Write the file
    fs.writeFileSync(filePath, nodeBuffer);
    
    return { success: true, filePath };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, message: error.message };
  }
}