const { Client, Collection, GatewayIntentBits, Partials } = require('discord.js');
const bot = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildInvites ], partials: [ Partials.Channel, Partials.Message, Partials.User, Partials.GuildMember, Partials.Reaction, Partials.ThreadMember, Partials.GuildScheduledEvent ] });

bot.slashcommand = new Collection();
const eventdHandler = require('./Handlers/event')(bot);
const slashcommandHandler = require('./Handlers/loadslashcommand.js')(bot);
const loadDatabase = require('./Handlers/loadDatabase');
const DataBase = require('./Handlers/loginDatabase');
DataBase.connectDatabase(bot);
const anticrashHandler = require('./Handlers/anticrash.js');
anticrashHandler(bot);

bot.login(require('./config.json').token);