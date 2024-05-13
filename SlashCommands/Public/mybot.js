const config = require('../../config.json');
const Discord = require('discord.js');
  
  module.exports = {
    name: 'mybot',
    description: 'Permet de voir les bots d\'un utilisateur.',
    permission: 'Aucune',
    dm: true,
    options: [
        {
          type: 'user',
          name: 'utilisateur',
          description: 'L\'utilisateur dont vous voulez voir les bots.',
          required: true,
          autocomplete: true,
        }
      ],

    async run(bot, message, args) {
        let description = '', count = 0;
        await bot.db.query(`SELECT * FROM bot WHERE ownerId = '${args.getUser('utilisateur').id}'`, async (err, req) => {
            if(req.length < 1) {
                const embed = new Discord.EmbedBuilder()
                .setTitle('`❌` ▸ Aucun bot')
                .setDescription('> *L\'utilisateur que vous avez indiqué n\'a **aucun** bot !*')
                .setColor(config.color)
                return message.reply({ embeds: [embed], ephemeral: true })
            } else {
                let texteStarted
                await req.forEach(async (row) => {
                    const botId = row.botId;
                    const time = row.time;
                    let expire;

                    const started = await require('../../Utils/lauchChildProcess')(`./UsersBots/${botId}/index.js`, 'checkstart', await bot.users.fetch(botId), bot)
                    if(started == false) texteStarted = 'Allumé `🟢`', expire = 'Expire'
                    else texteStarted = 'Éteint `🔴`', expire = 'Expire'
                    const checkeckexpired = row.expired
                    if(checkeckexpired == 'true') expire = 'Expiré'
                    count++
                    description += `*\`${count}.)\` <@${botId}> (\`${botId}\`) | ${expire} <t:${time}:R> | ${texteStarted}*\n` 
                })

                setTimeout(() => { 
                const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setThumbnail(args.getUser('utilisateur').displayAvatarURL({ dynamic: true }))
                .setDescription(description || "Non défini")
                .setColor(config.color)
                .setTimestamp()
                .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })});
                return message.reply({ embeds: [embed], ephemeral: true })
              }, 250)
            }
        })
    }
}