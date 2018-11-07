const chokidar = require('chokidar');
const debounce = require('lodash.debounce');
const electron = require('electron');
const path = require('path');
const { spawn } = require('child_process')
const VueCliService = require('@vue/cli-service');

async function startRenderer() {
  const vueCliService = new VueCliService(process.cwd());
  await vueCliService.run('serve');
}

let manualRestart = false;
let electronProcess = null;
function startElectron() {
  var args = [
    path.join(__dirname, '../main/index.dev.js'),
  ];

  electronProcess = spawn(electron, args);

  electronProcess.stdout.pipe(process.stdout);
  electronProcess.stderr.pipe(process.stderr);

  electronProcess.on('close', () => {
    if (!manualRestart){
      process.exit();
    }
  });
}

function stopElectron() {
  if (electronProcess) {
    process.kill(electronProcess.pid)
    electronProcess = null;
  }
}

function restartElectron() {
  manualRestart = true;

  stopElectron();
  startElectron();

  setTimeout(() => {
    manualRestart = false;
  }, 5e3);
}

(async function serve() {
  await startRenderer();

  startElectron();

  const watcher = chokidar.watch(path.resolve(__dirname, '../main'), {
    ignoreInitial: true,
  });
  watcher.on('all', debounce(restartElectron, 500));
})();
