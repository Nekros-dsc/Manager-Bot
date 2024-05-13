const Discord = require('discord.js');

module.exports = {
  name: 'interactionCreate',
  async execute(interaction, bot) {

    if(interaction.type === Discord.InteractionType.ApplicationCommand) {
            const commandfile = bot.slashcommand.get(interaction.commandName);
            if(commandfile) {
                interaction.author = interaction.user;
                commandfile.run(bot, interaction, interaction.options);
            }
    }
  }}