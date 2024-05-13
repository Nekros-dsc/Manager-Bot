const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    name: 'updatebot',
    description: 'Permet de renouveler votre bot.',
    permission: 'Aucune',
    dm: true,
    options: [
      {
        type: 'string',
        name: 'identifiant',
        description: 'L\'identifiant du bot à renouveler.',
        required: true,
        autocomplete: false,
      },
      {
        type: 'string',
        name: 'key',
        description: 'La clé à utiliser.',
        required: true,
        autocomplete: false,
      }
    ],
  
    async run(bot, message, args) {
        let newtime; 
        const cle = args.getString('key')

        bot.db.query(`SELECT * FROM cle WHERE code = '${cle}'`, async (err, req) => {
            if(req.length < 1) {
                const embed = new Discord.EmbedBuilder()
                .setTitle('`❌` ▸ Clé invalide')
                .setDescription('> *La clé fournie n\'est pas valide.*')
                .setColor(config.color)
                return message.reply({ embeds: [embed], ephemeral: true })
                } else {
              if(req[0].use !== 'false') {
              const embed = new Discord.EmbedBuilder()
              .setDescription('`❌` ▸ Clé utilisée')
              .setDescription('> *La clé fournie est déjà utilisée.*')
              .setColor(config.color)
              .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
            return message.reply({ embeds: [embed], ephemeral: true })
              }
        await bot.db.query(`SELECT * FROM bot WHERE botId = '${args.getString('identifiant')}'`, async (err, req) => {
            if(req.length < 1) {
            const embed = new Discord.EmbedBuilder()
            .setDescription('`❌` ▸ Bot non trouvé')
            .setDescription(`> *Le bot que vous avez désigné n'a pas été trouvé. Pour créer un bot, faîtes la commande \`/create\`.*`)
            .setColor(config.color)
            .setTimestamp()
            .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
            return message.reply({ embeds: [embed], ephemeral: true })
            } else {
                if(req[0].expired == 'true') {
                    newtime = Math.floor(Date.now() / 1000) +  Math.floor(ms(req[0].day) / 1000)
                } else {
                    newtime = Number(req[0].time) + Math.floor(ms(req[0].day) / 1000)
                }
                const checkstart = require('../../Utils/lauchChildProcess')(`./UsersBots/${args.getString('identifiant')}/index.js`, 'checkstart')
                bot.db.query(`UPDATE bot SET time = ?, expired = ? WHERE botId = ?`, [newtime, 'false', args.getString('identifiant')]);
                if(checkstart == false) {
                    const embed = new Discord.EmbedBuilder()
                    .setDescription('`🪄` ▸ Renouvellement effectué')
                    .setDescription(`> *Votre bot a été **renouveler** avec succès.*`)
                    .setColor(config.color)
                    .setTimestamp()
                    .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })});
                    bot.db.query(`UPDATE cle SET \`use\` = ? WHERE code = ?`, [true, cle]);
                    return message.reply({ embeds: [embed], ephemeral: true });
                } else {
                    require('../../Utils/lauchChildProcess')(`./UsersBots/${args.getString('identifiant')}/index.js`, 'start')
                    bot.db.query(`UPDATE cle SET \`use\` = ? WHERE code = ?`, [true, cle]);
                    const embed = new Discord.EmbedBuilder()
                    .setDescription('`🪄` ▸ Renouvellement effectué')
                    .setDescription(`> *Votre bot a été **renouveler** avec succès. Votre bot a été relancer.*`)
                    .setColor(config.color)
                    .setTimestamp()
                    .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })});
                    message.reply({ embeds: [embed], ephemeral: true });
                }
            }
        })
    }})
    }
}