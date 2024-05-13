const fs = require('fs');

module.exports = (bot) => {
  const eventFiles = fs
    .readdirSync('./Events/')
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    const event = require(`../Events/${file}`);
    const eventName = event.name;
    const eventHandler = event.execute;

    if (event.once) {
      bot.once(eventName, (...args) => eventHandler(...args, bot));
    } else {
      bot.on(eventName, (...args) => eventHandler(...args, bot));
    }
  }

  const eventSubFolders = fs
    .readdirSync('./Events/')
    .filter((folder) => !folder.endsWith('.js'));

  for (const folder of eventSubFolders) {
    const subEventFiles = fs
      .readdirSync(`./Events/${folder}/`)
      .filter((file) => file.endsWith('.js'));

    for (const file of subEventFiles) {
      const event = require(`../Events/${folder}/${file}`);
      const eventName = event.name;
      const eventHandler = event.execute;

      if (event.once) {
        bot.once(eventName, (...args) => eventHandler(...args, bot));
      } else {
        bot.on(eventName, (...args) => eventHandler(...args, bot));
      }
    }
  }
};