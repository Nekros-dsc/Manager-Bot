const config = require('../config.json');
const { exec } = require('child_process');
const fs = require('fs');

let check = false
function stopallbot() {
    if(check === true) return;

config.PID.forEach((pid) => {
    exec(`kill ${pid}`, () => {});
  })
  const configachanger = require('../config.json');
  configachanger.PID = [];

  fs.writeFileSync('./config.json', JSON.stringify(configachanger, null, 2));
  check = true;
}

module.exports = stopallbot