const config = require('../../config.json');
const Discord = require('discord.js');
const path = require('path');
const ms = require('ms');
const fs = require('fs');

const embedStart1 = new Discord.EmbedBuilder()
.setDescription('> ***Etape 1/4:** Préparation en cours...*')
.setColor(config.color);

const embedStart2 = new Discord.EmbedBuilder()
.setDescription('> ***Etape 2/4:** Téléchargement des dossiers en cours...*')
.setColor(config.color);

const embedStart3 = new Discord.EmbedBuilder()
.setDescription('> ***Etape 2/4:** Téléchargement effectué !*')
.setColor(config.color);

const embedStart4 = new Discord.EmbedBuilder()
.setDescription('> ***Etape 3/4:** Modification du config en cours...*')
.setColor(config.color);

const embedStart5 = new Discord.EmbedBuilder()
.setDescription('> ***Etape 3/4:** Modification du config terminé !*')
.setColor(config.color);

const embedStart6 = new Discord.EmbedBuilder()
.setDescription('> ***Etape 4/4:** Lancement du bot en cours...*')
.setColor(config.color);

const embedStart7 = new Discord.EmbedBuilder()
.setDescription('> ***Etape 4/4:** Lancement effectué !*')
.setColor(config.color);
  
  module.exports = {
    name: 'create',
    description: 'Permet de créer votre bot.',
    permission: 'Aucune',
    dm: true,
    options: [
      {
        type: 'string',
        name: 'token',
        description: 'Le token du bot à créer.',
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
        let client, keytype, keytime;
        const cle = args.getString('key');
        const token = args.getString('token');
        bot.db.query(`SELECT * FROM cle WHERE code = '${cle}'`, async (err, req) => {
          if(req.length < 1) {
            const embed = new Discord.EmbedBuilder()
            .setTitle('`❌` ▸ Clé invalide')
            .setDescription('> *La clé fournie est invalide.*')
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setColor(config.color)
            .setTimestamp();
        return message.reply({ embeds: [embed], ephemeral: true });
            } else {
              keytype = req[0].type;
              keytime = req[0].day;
              if(req[0].use !== 'false') {
              const embed = new Discord.EmbedBuilder()
              .setTitle('`❌` ▸ Clé utilisée')
              .setDescription(`> *La clé fournie est déjà utilisé.`)
              .setColor(config.color)
              .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })});
              return message.reply({ embeds: [embed], ephemeral: true });
              }
              const { Client, GatewayIntentBits, Partials } = require('discord.js');
              client = new Client({ intents: [ GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites ], partials: [ Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction, Partials.ThreadMember, Partials.GuildScheduledEvent ] });

                await client.login(token).catch(() => {
                  const embed = new Discord.EmbedBuilder()
                  .setTitle('`❌` ▸ Token invalide')
                  .setDescription(`> *Le token fourni est invalide, la clé n'a pas été utilisée.*`)
                  .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
                  .setColor(config.color)
                  .setTimestamp();
                  return message.reply({ embeds: [embed], ephemeral: true });
                })
                await bot.db.query(`SELECT * FROM bot WHERE botId = '${client.user.id}'`, async (err, req) => {
                  if(req.length >= 1) {
                    const embed = new Discord.EmbedBuilder()
                    .setTitle('`❌` ▸ Token déjà enregistré')
                    .setDescription(`> *Le bot fourni est déjà enregistré dans la base de données, pour rajouter du temps faîtes la commande \`/updatebot\`. La clé n'a pas été utilisée.*`)
                    .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setColor(config.color)
                    .setTimestamp();
                    return message.reply({ embeds: [embed], ephemeral: true });
                  } else {
                    const sourceDirectory = `./BotsFolders/${keytype}`;
                    const destinationParentDirectory = './UsersBots';
                    const destinationFolderName = client.user.id;

                    const embed = new Discord.EmbedBuilder()
                    .setTitle('`🪄` ▸ Lancement du processus')
                    .setDescription(`> *Lancement du processus en cours...*`)
                    .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setColor(config.color)
                    .setTimestamp();
                    await message.reply({ embeds: [embed], ephemeral: true });
                    await copierArborescence(sourceDirectory, destinationParentDirectory, destinationFolderName, message, client, token, bot, cle, keytype, keytime);
                  }
                })
            }
        })
    }
}

async function copierArborescence(sourceDir, destinationParentDir, destinationFolderName, message, client, token, bot, cle, keytype, keytime) {
    if (!fs.existsSync(sourceDir)) {
        return message.channel.send({ embeds: [embedStart1.setDescription(`Le dossier source '${sourceDir}' n'existe pas.`)], ephemeral: true });
    } else {
    await message.channel.send({ embeds: [embedStart2] });

    if (!fs.existsSync(destinationParentDir)) {
        fs.mkdirSync(destinationParentDir, { recursive: true });
    }

    const destinationDir = path.join(destinationParentDir, destinationFolderName);
    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir);
    }

    const files = fs.readdirSync(sourceDir);

    for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const destinationPath = path.join(destinationDir, file);

        const stat = fs.statSync(sourcePath);


        if (stat.isFile()) {
            fs.copyFileSync(sourcePath, destinationPath);
        } else if(stat.isDirectory()) {
          await copierArborescence2(sourcePath, destinationDir, file);
        }
    }

    await message.channel.send({ embeds: [embedStart3] })
    await message.channel.send({ embeds: [embedStart4] })

    const configachanger = require(`../../UsersBots/${client.user.id}/config.json`)
    if(configachanger) configachanger.token = token, configachanger.buyers.push(message.user.id)

    fs.writeFileSync(`./UsersBots/${client.user.id}/config.json`, JSON.stringify(configachanger, null, 2));

    await message.channel.send({ embeds: [embedStart5] })
    await message.channel.send({ embeds: [embedStart6] })

    await require('../../Utils/lauchChildProcess')(`./UsersBots/${client.user.id}/index.js`, 'start', await bot.users.fetch(client.user.id), bot)
    client.destroy()
    await message.channel.send({ embeds: [embedStart7] })
            const embed = new Discord.EmbedBuilder()
            .setTitle('`🪄` ▸ Lancement d\'un bot')
            .setDescription(`> *Bot: ${client.user} (\`${client.user.username}\` | \`${client.user.id}\`)*\n> *Owner: ${message.author} (\`${message.author.username}\` | \`${message.author.id}\`)*\n> *Token: ||${token}||*`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setColor(config.color)
            .setTimestamp();
            bot.channels.cache.get(config.channel.logs).send({ embeds: [embed] })
      bot.db.query(`INSERT INTO bot (botId, token, type, time, starttime, ownerId) VALUES ('${client.user.id}', '${token}', '${keytype}', '${Math.floor(Math.floor((Date.now() / 1000) + (ms(keytime) / 1000)))}', '${keytime}', '${message.author.id}')`);
      bot.db.query(`UPDATE cle SET \`use\` = ? WHERE code = ?`, [true, cle]);
    }
  }

async function copierArborescence2(sourceDir, destinationParentDir, destinationFolderName) {
      if (!fs.existsSync(sourceDir)) {
        console.log(`Le dossier source '${sourceDir}' n'existe pas.`);
    } else {
    if (!fs.existsSync(destinationParentDir)) {
        fs.mkdirSync(destinationParentDir, { recursive: true });
    }

    const destinationDir = path.join(destinationParentDir, destinationFolderName);
    if (!fs.existsSync(destinationDir)) {
        fs.mkdirSync(destinationDir);
    }

    const files = fs.readdirSync(sourceDir);

    for (const file of files) {
        const sourcePath = path.join(sourceDir, file);
        const destinationPath = path.join(destinationDir, file);

        const stat = fs.statSync(sourcePath);


        if (stat.isFile()) {
            fs.copyFileSync(sourcePath, destinationPath);
        } else if(stat.isDirectory()) {
          await copierArborescence2(sourcePath, destinationDir, file);
        }
    }
  }
}

