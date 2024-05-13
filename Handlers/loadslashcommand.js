const fs = require('fs');

module.exports = async (bot) => {
    const commandFiles = fs
    .readdirSync('./SlashCommands/')
    .filter((file) => file.endsWith('.js'));

  for (const file of commandFiles) {
    const props = require(`../SlashCommands/${file}`);
    bot.slashcommand.set(props.name, props);
  }

  const commandSubFolders = fs
    .readdirSync('./SlashCommands/')
    .filter((folder) => !folder.endsWith('.js'));

  for (const folder of commandSubFolders) {
    const subCommandFiles = fs
      .readdirSync(`./SlashCommands/${folder}/`)
      .filter((file) => file.endsWith('.js'));

    for (const file of subCommandFiles) {
      const props = require(`../SlashCommands/${folder}/${file}`);
      bot.slashcommand.set(props.name, props);
    }
  }
};