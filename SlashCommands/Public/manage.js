const config = require('../../config.json');
const Discord = require('discord.js')

  module.exports = {
    name: 'manage',
    description: 'Permet de gérer votre bot.',
    permission: 'Aucune',
    dm: true,
    async run(bot, message) {
        let description = '', count = 0, identifiant = null;
        await bot.db.query(`SELECT * FROM bot WHERE ownerId = '${message.author.id}'`, async (err, req) => {
            if(req.length < 1) {
                const embed = new Discord.EmbedBuilder()
                .setTitle('`❌` ▸ Aucun bot')
                .setDescription(`> *Vous n'avez **aucun** bot.*`)
                .setColor(config.color);
                return message.reply({ embeds: [embed], ephemeral: true });
            } else {
                let texteStarted;
                let selectMenuArray = [];
                req.forEach(async (row) => {
                    const botId = row.botId;
                    const time = row.time;
                    let expire;

                    const started = await require('../../Utils/lauchChildProcess')(`./UsersBots/${botId}/index.js`, 'checkstart', await bot.users.fetch(botId), bot)
                    if(started == false) texteStarted = 'Allumé `🟢`', expire = 'Expire'
                    else texteStarted = 'Éteint `🔴`', expire = 'Expire'
                    const checkeckexpired = row.expired
                    if(checkeckexpired == 'true') expire = 'Expiré'

                    count++
                    let discordBotName = await bot.users.fetch(row.botId)
                    selectMenuArray.push({
                        label: `${discordBotName.username}`, 
                        value: `${discordBotName.id}`,
                        description: `Gérer ${discordBotName.username}`
                    })
                    description += `*\`${count}.)\` ${discordBotName} (\`${discordBotName.username}\` | \`${discordBotName.id}\`) | ${expire} <t:${time}:R> | ${texteStarted}*\n` 
                })
                setTimeout(async() => {
                const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(description)
                .setColor(config.color)
                .setTimestamp()
                .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })});
                
                let Select = new Discord.StringSelectMenuBuilder()
                .setCustomId('startselect')
                .setPlaceholder('Manage Bots')
                
                Select.addOptions(selectMenuArray); 
                const row = new Discord.ActionRowBuilder().addComponents(Select);
                
                const msg = await message.reply({ embeds: [embed], components: [row], ephemeral: true })

                const collector = await msg.createMessageComponentCollector({})

                collector.on('collect', async (interaction) => {
                    if(interaction.user.id !== message.author.id) {
                    const embed = new Discord.EmbedBuilder()
                    .setTitle('`❌` ▸ Utilisateur non autorisé')
                    .setDescription('> *Vous n’êtes pas autorisé à utiliser cette interaction.*')
                    .setFooter({ text: i.user.username, iconURL: i.user.displayAvatarURL() })
                    .setColor(config.color)
                    .setTimestamp();
                return interaction.reply({ embeds: [embed], ephemeral: true });
                    }

                if(interaction.customId == 'startselect') {
                    await bot.db.query(`SELECT * FROM bot WHERE botId = '${interaction.values[0]}'`, async (err, req) => {

                    const time = req[0].time
                    let expire, expirebutton = false, buttonstart = false, buttonstop = false
                    const botId = await bot.users.fetch(interaction.values[0])
                    
                    const started = await require('../../Utils/lauchChildProcess')(`./UsersBots/${interaction.values[0]}/index.js`, 'checkstart', await bot.users.fetch(botId), bot)
                    if(started == false) texteStarted = 'Allumé `🟢`', expire = 'Expire', buttonstart = true
                    else texteStarted = 'Éteint `🔴`', expire = 'Expire', buttonstop = true
                    const checkeckexpired = req[0].expired
                    if(checkeckexpired == 'true') expire = 'Expiré', expirebutton = true

                    const embed = new Discord.EmbedBuilder()
                    .setTitle(botId.username)
                    .setDescription(`*${botId} (\`${botId.username}\` | \`${botId.id}\`) | ${expire} <t:${time}:R> | ${texteStarted}*`)
                    .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
                    .setTimestamp()
                    .setThumbnail(botId.displayAvatarURL({ dynamic: true }))
                    .setColor(config.color)
                    
                    const botton1 = new Discord.ButtonBuilder()
                    .setCustomId('start')
                    .setLabel(`Lancer`)
                    .setStyle(Discord.ButtonStyle.Success)
                    .setDisabled(expirebutton || buttonstart)
                    const botton2 = new Discord.ButtonBuilder()
                    .setCustomId('stop')
                    .setLabel(`Arrêter`)
                    .setStyle(Discord.ButtonStyle.Danger)
                    .setDisabled(expirebutton || buttonstop)
                    const botton3 = new Discord.ButtonBuilder()
                    .setCustomId('restart')
                    .setLabel(`Redémarrer`)
                    .setStyle(Discord.ButtonStyle.Secondary)
                    .setDisabled(expirebutton)
                    const botton4 = new Discord.ButtonBuilder()
                    .setCustomId('return')
                    .setLabel(`Retour`)
                    .setStyle(Discord.ButtonStyle.Primary)

                    identifiant = interaction.values[0]

                    await interaction.update({ embeds: [embed], components: [new Discord.ActionRowBuilder().addComponents(botton1, botton2, botton3, botton4)] })
                    })
                } else if(interaction.customId == 'stop') {
                    await bot.db.query(`SELECT * FROM bot WHERE botId = '${identifiant}'`, async (err, req) => {

                        const time = req[0].time
                        let expire, expirebutton = false, buttonstart = false, buttonstop = false
                        const botId = await bot.users.fetch(identifiant)

                        const started = await require('../../Utils/lauchChildProcess')(`./UsersBots/${identifiant}/index.js`, 'checkstart', await bot.users.fetch(botId), bot)
                        if(started == false) texteStarted = 'Allumé `🟢`', expire = 'Expire', buttonstart = true
                        else texteStarted = 'Éteint `🔴`', expire = 'Expire', buttonstop = true
                        const checkeckexpired = req[0].expired
                        if(checkeckexpired == 'true') expire = 'Expiré', expirebutton = true
    
                        const embed3 = new Discord.EmbedBuilder()
                        .setTitle(botId.username)
                        .setDescription(`*${botId} (\`${botId.username}\` | \`${botId.id}\`) | ${expire} <t:${time}:R> | Éteint \`🔴\`*`)
                        .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
                        .setTimestamp()
                        .setThumbnail(botId.displayAvatarURL({ dynamic: true }))
                        .setColor(config.color)
                        
                        const botton1 = new Discord.ButtonBuilder()
                        .setCustomId('start')
                        .setLabel(`Lancer`)
                        .setStyle(Discord.ButtonStyle.Success)
                        .setDisabled(false);
                        const botton2 = new Discord.ButtonBuilder()
                        .setCustomId('stop')
                        .setLabel(`Arrêter`)
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setDisabled(true);
                        const botton3 = new Discord.ButtonBuilder()
                        .setCustomId('restart')
                        .setLabel(`Redémarrer`)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setDisabled(expirebutton);
                        const botton4 = new Discord.ButtonBuilder()
                        .setCustomId('return')
                        .setLabel(`Retour`)
                        .setStyle(Discord.ButtonStyle.Primary);
                        
                        bot.db.query(`UPDATE bot SET started = ? WHERE botId = ?`, ['false', identifiant]);
                        const embed2 = new Discord.EmbedBuilder()
                        .setTitle('`🪄` ▸ Bot arrêté')
                        .setDescription(`> *Le bot a été arrêté avec succès.*`)
                        .setColor(config.color)
                        .setTimestamp()
                        .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
                        await require('../../Utils/lauchChildProcess')(`./UsersBots/${identifiant}/index.js`, 'stop', await bot.users.fetch(botId), bot);
                        await interaction.reply({ embeds: [embed2], ephemeral: true });
                        await msg.edit({ embeds: [embed3], components: [new Discord.ActionRowBuilder().addComponents(botton1, botton2, botton3, botton4)] })
                        })
                } else if(interaction.customId == 'start') {
                    await bot.db.query(`SELECT * FROM bot WHERE botId = '${identifiant}'`, async (err, req) => {

                        const time = req[0].time
                        let expire, expirebutton = false, buttonstart = false, buttonstop = false
                        const botId = await bot.users.fetch(identifiant)

                        const started = await require('../../Utils/lauchChildProcess')(`./UsersBots/${identifiant}/index.js`, 'checkstart', await bot.users.fetch(botId), bot)
                        if(started == false) texteStarted = 'Allumé `🟢`', expire = 'Expire', buttonstart = true
                        else texteStarted = 'Éteint `🔴`', expire = 'Expire', buttonstop = true
                        const checkeckexpired = req[0].expired
                        if(checkeckexpired == 'true') expire = 'Expiré', expirebutton = true
    
    
                        const embed3 = new Discord.EmbedBuilder()
                        .setTitle(botId.username)
                        .setDescription(`*${botId} (\`${botId.username}\` | \`${botId.id}\`) | ${expire} <t:${time}:R> | Allumé \`🟢\`*`)
                        .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
                        .setTimestamp()
                        .setThumbnail(botId.displayAvatarURL({ dynamic: true }))
                        .setColor(config.color);
                        
                        const botton1 = new Discord.ButtonBuilder()
                        .setCustomId('start')
                        .setLabel(`Lancer`)
                        .setStyle(Discord.ButtonStyle.Success)
                        .setDisabled(true)
                        const botton2 = new Discord.ButtonBuilder()
                        .setCustomId('stop')
                        .setLabel(`Arrêter`)
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setDisabled(false)
                        const botton3 = new Discord.ButtonBuilder()
                        .setCustomId('restart')
                        .setLabel(`Redémarrer`)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setDisabled(expirebutton)
                        const botton4 = new Discord.ButtonBuilder()
                        .setCustomId('return')
                        .setLabel(`Retour`)
                        .setStyle(Discord.ButtonStyle.Primary)
                        
                        bot.db.query(`UPDATE bot SET started = ? WHERE botId = ?`, ['true', identifiant]);
                        const embed2 = new Discord.EmbedBuilder()
                        .setTitle('`🪄` ▸ Bot lancé')
                        .setDescription(`> *Le bot a été lancé avec succès.*`)
                        .setColor(config.color)
                        .setTimestamp()
                        .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
                         
                        await require('../../Utils/lauchChildProcess')(`./UsersBots/${identifiant}/index.js`, 'start', await bot.users.fetch(botId), bot) 
                        await interaction.reply({ embeds: [embed2], ephemeral: true });
                        await msg.edit({ embeds: [embed3], components: [new Discord.ActionRowBuilder().addComponents(botton1, botton2, botton3, botton4)] });
                    })
                } else if(interaction.customId == 'restart') {
                    await bot.db.query(`SELECT * FROM bot WHERE botId = '${identifiant}'`, async (err, req) => {

                        const time = req[0].time
                        let expire, expirebutton = false, buttonstart = false, buttonstop = false
                        const botId = await bot.users.fetch(identifiant)

                        const started = await require('../../Utils/lauchChildProcess')(`./UsersBots/${identifiant}/index.js`, 'checkstart', await bot.users.fetch(botId), bot)
                        if(started == false) texteStarted = 'Allumé `🟢`', expire = 'Expire', buttonstart = true
                        else texteStarted = 'Éteint `🔴`', expire = 'Expire', buttonstop = true
                        const checkeckexpired = req[0].expired
                        if(checkeckexpired == 'true') expire = 'Expiré', expirebutton = true
    
                        const embed3 = new Discord.EmbedBuilder()
                        .setTitle(botId.username)
                        .setDescription(`*${botId} (\`${botId.username}\` | \`${botId.id}\`) | ${expire} <t:${time}:R> | Allumé \`🟢\`*`)
                        .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
                        .setTimestamp()
                        .setThumbnail(botId.displayAvatarURL({ dynamic: true }))
                        .setColor(config.color)
                        
                        const botton1 = new Discord.ButtonBuilder()
                        .setCustomId('start')
                        .setLabel(`Lancer`)
                        .setStyle(Discord.ButtonStyle.Success)
                        .setDisabled(true)
                        const botton2 = new Discord.ButtonBuilder()
                        .setCustomId('stop')
                        .setLabel(`Arrêter`)
                        .setStyle(Discord.ButtonStyle.Danger)
                        .setDisabled(false)
                        const botton3 = new Discord.ButtonBuilder()
                        .setCustomId('restart')
                        .setLabel(`Redémarrer`)
                        .setStyle(Discord.ButtonStyle.Secondary)
                        .setDisabled(expirebutton)
                        const botton4 = new Discord.ButtonBuilder()
                        .setCustomId('return')
                        .setLabel(`Retour`)
                        .setStyle(Discord.ButtonStyle.Primary)
                        
                        bot.db.query(`UPDATE bot SET started = ? WHERE botId = ?`, ['true', identifiant]);
                        const embed2 = new Discord.EmbedBuilder()
                        .setTitle('`🪄` ▸ Bot relancé')
                        .setDescription(`> *Le bot a été relancé avec succès.*`)
                        .setColor(config.color)
                        .setTimestamp()
                        .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
                         
                        await require('../../Utils/lauchChildProcess')(`./UsersBots/${identifiant}/index.js`, 'stop', await bot.users.fetch(botId), bot)
                        await require('../../Utils/lauchChildProcess')(`./UsersBots/${identifiant}/index.js`, 'start', await bot.users.fetch(botId), bot)
                        await interaction.reply({ embeds: [embed2], ephemeral: true })
                        await msg.edit({ embeds: [embed3], components: [new Discord.ActionRowBuilder().addComponents(botton1, botton2, botton3, botton4)] })
                    })
                } else if(interaction.customId == 'return') {
                    description = '', count = 0 
                    await bot.db.query(`SELECT * FROM bot WHERE ownerId = '${message.author.id}'`, async (err, req) => {
                        if(req.length < 1) {
                            const embed = new Discord.EmbedBuilder()
                            .setTitle('`❌` ▸ Aucun bot')
                            .setDescription(`> *Vous n'avez **aucun** bot.*`)
                            .setColor(config.color);
                            return message.reply({ embeds: [embed], ephemeral: true });
                        } else {
                let texteStarted
                let selectMenuArray = [];
                req.forEach(async (row) => {
                    const botId = row.botId
                    const time = row.time
                    let expire

                    const started = await require('../../Utils/lauchChildProcess')(`./UsersBots/${botId}/index.js`, 'checkstart')
                    if(started == false) texteStarted = 'Allumé `🟢`', expire = 'Expire'
                    else texteStarted = 'Éteint `🔴`', expire = 'Expire'
                    const checkeckexpired = row.expired
                    if(checkeckexpired == 'true') expire = 'Expiré'

                    count++
                    let discordBotName = await bot.users.fetch(row.botId)
                    selectMenuArray.push({
                        label: `${discordBotName.username}`, 
                        value: `${discordBotName.id}`,
                        description: `Gérer ${discordBotName.username}`
                    })
                    description += `*\`${count}.)\` ${discordBotName} (\`${discordBotName.username}\` | \`${discordBotName.id}\`) | ${expire} <t:${time}:R> | ${texteStarted}*\n` 
                })
                setTimeout(async() => {
                const embed = new Discord.EmbedBuilder()
                .setAuthor({ name: message.author.username, iconURL: message.author.displayAvatarURL({ dynamic: true })})
                .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
                .setDescription(description)
                .setColor(config.color)
                .setTimestamp()
                .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })});
                
                let Select = new Discord.StringSelectMenuBuilder()
                .setCustomId('startselect')
                .setPlaceholder('Manage Bots')
                
                Select.addOptions(selectMenuArray); 
                const row = new Discord.ActionRowBuilder().addComponents(Select);
                
                return interaction.update({ embeds: [embed], components: [row], ephemeral: true })
                            })
                        }
                    })
                }
                })
                }, 500)
            }
        })

    }
}