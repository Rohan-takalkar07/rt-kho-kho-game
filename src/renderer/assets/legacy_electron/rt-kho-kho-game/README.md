# Kho-Kho Management System (Electron + React)

This project is a desktop application for managing Kho-Kho tournaments, built using **Electron** for the desktop shell and **React** for the UI components.

## 🚀 Project Architecture

The application follows a standard Electron multi-process architecture:

### 1. Main Process (`Main.js`)
- Acts as the entry point of the application.
- Manages application lifecycle and native desktop integration.
- creates and manages browser windows (`BrowserWindow`).
- Handles IPC (Inter-Process Communication) events to coordinate between windows and handle application state.
- Loads the initial `ground_.html` (and can load other views).

### 2. Renderer Process (UI)
- The user interface is built using HTML/CSS/JS and **React**.
- **Static HTML**: Files like `ground_.html`, `out.html` provide immediate views.
- **React UI**: Located in the `react-ui` directory, this modern frontend is powered by **Vite**.

### 3. IPC Communication
- Communication between the Main Process and Renderer processes happens via `ipcMain` and `ipcRenderer`.
- Used for tasks like opening popups, updating batch players, and handling game timer logic.

---

## 🛠️ Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (usually comes with Node.js)

---

## 📦 Installation

This project consists of two parts: the main Electron app and the React UI. You need to install dependencies for both.

### 1. Install Electron App Dependencies
Navigate to the root directory (where `package.json` is located) and run:

```bash
npm install
```

### 2. Install React UI Dependencies
Navigate to the `react-ui` directory and install its dependencies:

```bash
cd react-ui
npm install
```

---

## ▶️ Execution

### Running the Electron Application
 To start the main desktop application:

```bash
# From the root directory
npm start
```
This will launch the Electron window loading `ground_.html`.

### Running the React UI (Development Mode)
If you are developing components in the React app:

```bash
# From the react-ui directory
cd react-ui
npm run dev
```

### Building the React UI
To build the React application for production integration:

```bash
# From the react-ui directory
cd react-ui
npm run build
```

---

## 📂 Project Structure

- **`Main.js`**: Electron main process logic.
- **`ground_.html`**: Main game interface.
- **`react-ui/`**: Source code for the React-based user interface.
- **`Backend/`**: Placeholder for backend logic.
- **`DataBase/`**: Placeholder for database schemas and backups.
