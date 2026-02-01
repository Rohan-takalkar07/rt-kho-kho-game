const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  openNewWindow: (data) => ipcRenderer.send("open-window", data)
});