const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const XLSX = require("xlsx");
const path = require('path');

let mainWindow;
let popupWindow;



function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('dashboard.html');   // Start page
}

app.whenReady().then(createWindow);

// Listen for navigation request
ipcMain.on('go-to-create_tournament.html', () => { //dashboard to create tournament >>>> next
  mainWindow.loadFile('create_tournament.html');
});

ipcMain.on('dashboard.html', () => {
  mainWindow.loadFile('dashboard.html'); // tourament to dashboard >>>>>back
});

ipcMain.on('tournament-updates.html', () => {
  mainWindow.loadFile('tournament_updates.html'); // navigate to tournament updates
});

ipcMain.on('add_difender.hrml', () => {
  mainWindow.loadFile('add_difrnder.html');
});

// popup for add difender - Batch 1
ipcMain.on('open-popup-batch1', () => {
  if (popupWindow) return
  popupWindow = new BrowserWindow({
    width: 500,
    height: 450,
    frame: false,
    transparent: true,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  popupWindow.loadFile('add_difender.html')
  // Send batch number to popup
  popupWindow.webContents.on('did-finish-load', () => {
    popupWindow.webContents.send('set-batch', 1);
  });

  mainWindow.maximize();
  popupWindow.on('close', () => {
    popupWindow = null
  })
})

// popup for add difender - Batch 2
ipcMain.on('open-popup-batch2', () => {
  if (popupWindow) return
  popupWindow = new BrowserWindow({
    width: 500,
    height: 450,
    frame: false,
    transparent: true,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  popupWindow.loadFile('add_difender.html')
  popupWindow.webContents.on('did-finish-load', () => {
    popupWindow.webContents.send('set-batch', 2);
  });

  mainWindow.maximize();
  popupWindow.on('close', () => {
    popupWindow = null
  })
})

// popup for add difender - Batch 3
ipcMain.on('open-popup-batch3', () => {
  if (popupWindow) return
  popupWindow = new BrowserWindow({
    width: 500,
    height: 450,
    frame: false,
    transparent: true,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  popupWindow.loadFile('add_difender.html')
  popupWindow.webContents.on('did-finish-load', () => {
    popupWindow.webContents.send('set-batch', 3);
  });

  mainWindow.maximize();
  popupWindow.on('close', () => {
    popupWindow = null
  })
})

// popup for substitute players
ipcMain.on('open-popup-substitute', () => {
  if (popupWindow) return
  popupWindow = new BrowserWindow({
    width: 500,
    height: 450,
    frame: false,
    transparent: true,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  popupWindow.loadFile('add_difender.html')
  popupWindow.webContents.on('did-finish-load', () => {
    popupWindow.webContents.send('set-batch', 'Substitute');
  });

  mainWindow.maximize();
  popupWindow.on('close', () => {
    popupWindow = null
  })
})

// Receive selected players from popup and send to appropriate batch
ipcMain.on('players-selected-batch1', (event, players) => {
  mainWindow.webContents.send('update-batch1', players);
})

ipcMain.on('players-selected-batch2', (event, players) => {
  mainWindow.webContents.send('update-batch2', players);
})

ipcMain.on('players-selected-batch3', (event, players) => {
  mainWindow.webContents.send('update-batch3', players);
})

ipcMain.on('players-selected-substitute', (event, players) => {
  mainWindow.webContents.send('update-substitute', players);
})

// Send assigned players to popup for validation
ipcMain.on('request-assigned-players', (event) => {
  mainWindow.webContents.send('get-assigned-players');
})


ipcMain.on('assigned-players-response', (event, assignedPlayers) => {
  if (popupWindow) {
    popupWindow.webContents.send('assigned-players', assignedPlayers);
  }
})

// Open out.html when a spot is clicked
// Open out.html when a spot is clicked
ipcMain.on('open-window', (event, data) => {
  let newWindow = new BrowserWindow({
    width: 850,
    height: 700,
    parent: mainWindow,
    frame: false,
    transparent: true,
    modal: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  newWindow.loadFile('out.html');

  newWindow.webContents.on('did-finish-load', () => {
    newWindow.webContents.send('init-out-data', data);
  });

  newWindow.on('closed', () => {
    newWindow = null;
  });

  // store reference to close it later if needed, though 'out-complete' handler can find it or we can reply to event.sender
});

ipcMain.on('out-complete', (event, nextDefenderIndex) => {
  if (mainWindow) {
    mainWindow.webContents.send('start-next-defender', nextDefenderIndex);
  }
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

ipcMain.on('batch-selected', (event, batchNum) => {
  if (mainWindow) {
    mainWindow.webContents.send('load-batch', batchNum);
  }
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

ipcMain.on('close-out-window', (event) => {
  // Send cancel event to main window so it can restore player state
  if (mainWindow) {
    mainWindow.webContents.send('out-cancelled');
  }
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

// popup for adding new staff member
ipcMain.on('open-add-staff-popup', (event, data) => {
  if (popupWindow) return

  const parentWindow = BrowserWindow.fromWebContents(event.sender) || mainWindow;

  popupWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    transparent: true,
    modal: true,
    parent: parentWindow,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  popupWindow.loadFile('renderer/Electron/Staff_Login/Add_Staff_Popup.html')

  popupWindow.webContents.on('did-finish-load', () => {
    if (data) {
      popupWindow.webContents.send('init-staff-data', data);
    }
  });

  popupWindow.on('close', () => {
    popupWindow = null
  })
})

// Forward added staff data to parent window
ipcMain.on('staff-added', (event, staffData) => {
  if (popupWindow) {
    const parent = popupWindow.getParentWindow();
    if (parent) {
      parent.webContents.send('new-staff-data', staffData);
    }
    popupWindow.close();
  } else if (mainWindow) {
    // Fallback if popup reference is lost but logic holds
    mainWindow.webContents.send('new-staff-data', staffData);
  }
})

// Close staff popup
ipcMain.on('close-staff-popup', () => {
  if (popupWindow) {
    popupWindow.close();
  }
})



// Open tournament dashboard in a new window
ipcMain.on('open-tournament-dashboard', (event, name) => {
  let tourneyWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  tourneyWindow.loadFile('tournament_dashboard.html', { query: { name: name } });

  tourneyWindow.on('closed', () => {
    tourneyWindow = null;
  });
});
// Receive request from frontend to open dialog
ipcMain.handle("select-excel", async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    filters: [{ name: "Excel", extensions: ["xlsx", "xls"] }],
    properties: ["openFile"]
  });

  if (canceled) return { canceled: true };

  // Read Excel
  const workbook = XLSX.readFile(filePaths[0]);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rowData = XLSX.utils.sheet_to_json(sheet);

  return { canceled: false, data: rowData };
});
