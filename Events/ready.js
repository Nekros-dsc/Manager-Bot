const loadSlashCommands = require('../Handlers/slashcommand');
const Discord = require('discord.js');
const config = require('../config.json');

module.exports = {
  name: 'ready',
  async execute(bot) {
    await loadSlashCommands(bot);
    console.log(`[!] — Logged in as ${bot.user.tag} (${bot.user.id})`); 
    
    require('../Utils/stopallbot')();
    await bot.db.query(`SELECT * FROM bot`, async (err, req) => {
      req.forEach(async (row) => {
        if(row.expired == 'true') return;
        console.log(row.botId)
        require('../Utils/lauchChildProcess')(`./UsersBots/${row.botId}/index.js`, 'start', await bot.users.fetch(row.botId), bot);
      })
    })

    setInterval(() => {
      bot.db.query(`SELECT * FROM bot`, async (err, req) => {
        if(req.length < 1) return
        req.forEach(async (row) => {
          const botId = row.botId;
          const ownerId = row.ownerId;
          if(row.time <= Math.floor(Date.now() / 1000)) {
            if(row.expired == 'true') return;
            require('../Utils/lauchChildProcess')(`./UsersBots/${botId}/index.js`, 'stop', await bot.users.fetch(row.botId), bot);
            if(bot.users.cache.get(ownerId)) {
              bot.db.query(`UPDATE bot SET \`expired\` = ? WHERE botId = ?`, ['true', botId]);
              const embed = new Discord.EmbedBuilder()
              .setDescription('> *Votre bot s\est arrêté à cause d\'un manque de renouvellement, pour renouveler votre bot faîte la commande \`/updatebot\` !*')
              .setColor(config.color);
              return bot.users.cache.get(ownerId).send({ embeds: [embed] });
            }

            const logsEmbed = new Discord.EmbedBuilder()
            .setDescription(`> *le bot <@${botId}> \`${botId}\` s'est arrêté par manque de renouvellement ! Owner: <@${ownerId}> \`${ownerId}\`.*`)
            .setColor(config.color);
            return bot.channels.cache.get(config.channel.logs).send({ embeds: [logsEmbed] });
          } else {
            return;
          }
        })
      })
    }, 10000)
  },
};
