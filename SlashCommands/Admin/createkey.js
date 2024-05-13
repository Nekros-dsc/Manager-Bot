const config = require('../../config.json');
const Discord = require('discord.js');
const ms = require('ms');
  
  module.exports = {
    name: 'createkey',
    description: 'Permets de créer une/des clé(s).',
    permission: 'Aucune',
    dm: true,
    options: [
      {
        type: 'string',
        name: 'type',
        description: 'Le type de bot que vous souhaitez avoir une/des clé(s).',
        required: true,
        autocomplete: false,
      },
      {
        type: 'string',
        name: 'time',
        description: 'Le temps de l\'offre.',
        required: true,
        autocomplete: false,
      },
      {
        type: 'number',
        name: 'nb_key',
        description: 'Le nombre de clés à générer.',
        required: false,
        autocomplete: false,
      },
    ],
  
    async run(bot, message, args) {
        if(!config.owners.includes(message.author.id)) {
            const embed = new Discord.EmbedBuilder()
                .setTitle('`❌` ▸ Utilisateur non autorisé')
                .setDescription('> *Vous n’êtes pas autorisé à utiliser cette commande.*')
                .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
                .setColor(config.color)
                .setTimestamp();
            return message.reply({ embeds: [embed], ephemeral: true });
        }
        const time = await validerDuree(args.getString('time'));
        let number = args.getNumber('nb_key');
        if(!number) number = 1;

        if (time !== false) {
            const keys = genererCle(number)
            const embed = new Discord.EmbedBuilder()
            .setTitle('`🪄` ▸ Clés générées')
            .setDescription(`> *Les clés suivantes ont été générer avec succès:*\n\`${keys.join('\n')}\`\n**Informations:**\n> *Type de bot:* \`${args.getString('type')}\`\n> *Temps:* \`${args.getString('time')}\`\n> *Nombre de clés:* \`${args.getNumber('nb_key') || '1'}\``)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setColor(config.color)
            .setTimestamp();
            await message.reply({ embeds: [embed], ephemeral: true });
            keys.forEach(async (key) => {
            bot.db.query(`SELECT * FROM cle WHERE code = '${key}'`, async (err, req) => {
                if(req.length < 1) {
                    bot.db.query(`INSERT INTO cle (code, type, day) VALUES ('${key}', '${args.getString('type')}', '${args.getString('time')}')`)
                } else {
                    const embed = new Discord.EmbedBuilder()
                    .setTitle('`❌` ▸ Clé déjà enregistrée')
                    .setDescription(`> *La clé suivante est déjà enregistrée dans la base de données.*`)
                    .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
                    .setColor(config.color)
                    .setTimestamp();
                    return message.reply({ embeds: [embed], ephemeral: true });
                }
            })
        })
        } else {
            const embed = new Discord.EmbedBuilder()
            .setTitle('`❌` ▸ Temps invalide')
            .setDescription(`> *Veuillez fournir un temps valide.*`)
            .setFooter({ text: message.author.username, iconURL: message.author.displayAvatarURL() })
            .setColor(config.color)
            .setTimestamp();
            return message.reply({ embeds: [embed], ephemeral: true });
        }
    }
}

function validerDuree(duree) {
    try {
        const milliseconds = ms(duree);
        if (!milliseconds || isNaN(milliseconds)) return false;
        return milliseconds;
    } catch {}
}

function genererCle(nb) {
    const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.';
    const clesGenerees = [];
    for (let j = 0; j < nb; j++) {
        let cle = '';
        for (let i = 0; i < 20; i++) {
            const indiceAleatoire = Math.floor(Math.random() * caracteres.length);
            cle += caracteres.charAt(indiceAleatoire);
        }
        clesGenerees.push(`${cle}`);
    }
    return clesGenerees;
}