module.exports = {
  connectDatabase(bot) {
    const loadDatabase = require('./loadDatabase');

    bot.db = loadDatabase();

    bot.db.connect(function (err) {
      if (!err) {
        console.log('\x1b[32mLa database s\'est connecté avec succès.\x1b[0m');
      } else {
        console.log('\x1b[31mLa database ne s\'est pas connecté.\x1b[30m');
        process.exit();
      }
    });
  },
};