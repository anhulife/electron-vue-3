/* eslint-disable */

// install devtools
const { default: installExtension, VUEJS_DEVTOOLS } = require('electron-devtools-installer');

// debug
require('electron-debug')();

require('electron').app.on('ready', () => installExtension(VUEJS_DEVTOOLS).catch(console.log));

require('./index');
