const config = require('../../config.json');
const Discord = require('discord.js');
  
  module.exports = {
    name: 'help',
    description: 'Permet de voir la liste de commande du bot.',
    permission: 'Aucune',
    dm: true,
    async run(bot, message) {
        const embed = new Discord.EmbedBuilder()
        .setTitle('`🪄` ▸ Help Menu')
        .setDescription(`\`/help\`\n*— Permet de voir la liste des commandes du bot.*\n\`/updatebot\`\n*— Permet de renouveler votre bot.*\n\`/create\`\n*— Permet de créer un bot.*\n\`/mybot\`\n*— Permet de voir les bots d'un utilisateur.*\n\`/manage\`\n*— Permet de gérer vos bots.*\n\`/createkey\`\n*— Permet de créer une/des clé(s) pour un bot.*`)
        .setFooter({ text: message.user.username, iconURL: message.user.displayAvatarURL({ dynamic: true })})
        .setTimestamp()
        .setColor(config.color);
        return message.reply({ embeds: [embed], ephemeral: true });
    }
}
