const { exec } = require('child_process');
const childProcesses = [];
const fs = require('fs');

async function launchChildProcess(filePath, option, botId, bot) {
    if(option == 'start') {
    const childProcess = exec(`node ${filePath}`);
    console.log(`\x1b[32m[!] — Bot Connecté: ${botId.username} (${botId.id})\x1b[0m`);
    childProcesses.push({ process: childProcess, file: filePath });
    const configachanger = require('../config.json');
    configachanger.PID.push(childProcess.pid);

    fs.writeFileSync('./config.json', JSON.stringify(configachanger, null, 2));

    await bot.db.query(`UPDATE bot SET \`started\` = ? WHERE botId = ?`, ['true', botId.id]);

    } else if(option == 'stop') {
        const index = childProcesses.findIndex(item => item.file === filePath);
        if (index !== -1) {
            console.log(`\x1b[31m[!] — Bot Déconnecté: ${botId.username} (${botId.id})\x1b[0m`);
            const { process } = childProcesses[index];
            await bot.db.query(`UPDATE bot SET \`started\` = ? WHERE botId = ?`, ['false', botId.id]);
            process.kill(); 
            childProcesses.splice(index, 1);
        }
    } else if(option == 'checkstart') {
        const index = childProcesses.findIndex(item => item.file === filePath);
        if (index !== -1) {
            const { process } = childProcesses[index];
            if (!process.killed) {
                return false;
              } else {
                return true;
              }
        }
    }
}

  module.exports = launchChildProcess