require("dotenv").config();
const config = require("./server/config/config");
const createHTTPServer = require("./server/server/http");
const createWebSocketServer = require("./server/server/ws");

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const path = require("path");
const url = require("url");
const isDev = require("electron-is-dev");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({ width: 900, height: 680 });
  mainWindow.loadURL(
    isDev
      ? "http://localhost:7072"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );

  const _server = createHTTPServer({
    port: config.FAZZ_DEBUGGER_PORT,
    onServe: () =>
      console.log(`Server already run at port ${config.FAZZ_DEBUGGER_PORT}`)
  });

  createWebSocketServer(_server);

  mainWindow.on("closed", () => (mainWindow = null));
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
