document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('startBtn');
  const stopBtn = document.getElementById('stopBtn');
  const status = document.getElementById('status');
  const filePath = document.getElementById('filePath');
  
  startBtn.addEventListener('click', async () => {
    try {
      const result = await window.electronAPI.startRecording();
      
      if (result.success) {
        startBtn.disabled = true;
        stopBtn.disabled = false;
        status.textContent = 'Recording...';
        filePath.textContent = `Saving to: ${result.filePath}`;
      } else {
        status.textContent = `Error: ${result.message}`;
      }
    } catch (error) {
      status.textContent = `Error: ${error.message}`;
    }
  });
  
  stopBtn.addEventListener('click', async () => {
    try {
      const result = await window.electronAPI.stopRecording();
      
      if (result.success) {
        startBtn.disabled = false;
        stopBtn.disabled = true;
        status.textContent = 'Recording saved!';
      } else {
        status.textContent = `Error: ${result.message}`;
      }
    } catch (error) {
      status.textContent = `Error: ${error.message}`;
    }
  });
});
