const Discord = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord.js');

module.exports = async (bot) => {
  let commands = [];

  bot.slashcommand.forEach((command) => {
    let slashCommand = new Discord.SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description)
      .setDMPermission(command.dm)
      .setDefaultMemberPermissions(
        command.permission === 'Aucune' ? null : command.permission
      );

    if (command.options?.length >= 1) {
      for (let i = 0; i < command.options.length; i++) {
        if (command.options[i].type === 'string')
          slashCommand[
            `add${
              command.options[i].type.slice(0, 1).toUpperCase() +
              command.options[i].type.slice(1, command.options[i].type.length)
            }Option`
          ]((option) =>
            option
              .setName(command.options[i].name)
              .setDescription(command.options[i].description)
              .setAutocomplete(command.options[i].autocomplete)
              .setRequired(command.options[i].required)
          );
        else
          slashCommand[
            `add${
              command.options[i].type.slice(0, 1).toUpperCase() +
              command.options[i].type.slice(1, command.options[i].type.length)
            }Option`
          ]((option) =>
            option
              .setName(command.options[i].name)
              .setDescription(command.options[i].description)
              .setRequired(command.options[i].required)
          );

        if (command.options[i].choices) {
          const choices = command.options[i].choices.map((choice) => ({
            name: choice.name,
            value: choice.value,
          }));

          for (const choice of choices) {
            option.addChoices(choice);
          }
        }
      }
    }
    commands.push(slashCommand.toJSON());
  });

  const rest = new REST({ version: '10' }).setToken(require('../config.json').token);

  await rest.put(Routes.applicationCommands(bot.user.id), { body: commands });
  console.log('Les slash commands sont chargés avec succès !');
};