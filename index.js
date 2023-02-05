const { 
    Client, 
    Events, 
    GatewayIntentBits,
    Collection, 
} = require('discord.js');

const { TOKEN } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ] 
});

client.commands = new Collection();

client.once(Events.ClientReady, c => {
	console.log(`${c.user.tag} is online`);
});

// client.on(Events.InteractionCreate, interaction => {
// 	console.log(interaction);
// });

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

    try {
		await command.execute(interaction);
	} catch (err) {
		console.error(err);
	}
});

client.login(TOKEN);

const cmd_path = path.join(__dirname, 'cmds');
const cmd_files = fs
    .readdirSync(cmd_path)
    .filter(file => file.endsWith('.js'));

for (const file of cmd_files) {
    const file_path = path.join(cmd_path, file)
    const cmd = require(file_path);

    if ('data' in cmd && 'execute' in cmd) {
		client.commands.set(cmd.data.name, cmd);
	} else {
		console.log(`Command at ${file_path} is missing a required "data" or "execute" property.`);
	}
}