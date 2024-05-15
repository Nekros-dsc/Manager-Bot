const Discord = require('discord.js');
const bot = new Discord.Client({ intents: [Discord.GatewayIntentBits.Guilds, Discord.GatewayIntentBits.GuildMessages, Discord.GatewayIntentBits.MessageContent, Discord.GatewayIntentBits.GuildMembers, Discord.GatewayIntentBits.GuildPresences, Discord.GatewayIntentBits.GuildVoiceStates, Discord.GatewayIntentBits.DirectMessages, Discord.GatewayIntentBits.GuildMessageReactions, Discord.GatewayIntentBits.GuildEmojisAndStickers, Discord.GatewayIntentBits.GuildInvites], partials: [Discord.Partials.Channel, Discord.Partials.Message, Discord.Partials.User, Discord.Partials.GuildMember, Discord.Partials.Reaction, Discord.Partials.ThreadMember, Discord.Partials.GuildScheduledEvent] });

bot.on(Discord.Events.MessageCreate, async(message) => {
    if(message.content === 'ping') {
        return message.reply(`*\`${bot.ws.ping}\` ms !*`)
    }
})
bot.login(require('./config.json').token)
