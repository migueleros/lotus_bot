const { REST, Routes } = require('discord.js');
const { CLIENT_ID, GUILD_ID, TOKEN } = require('./config.json');
const fs = require('node:fs');

const rest = new REST({ version: '10' }).setToken(TOKEN);

const cmds = [];
const cmds_file = fs
	.readdirSync('./cmds')
	.filter(file => file.endsWith('.js'));

for (const file of cmds_file) {
	const command = require(`./cmds/${file}`);
	cmds.push(command.data.toJSON());
}

(async () => {
	try {
		console.log(`Started refreshing ${cmds.length} application (/) commands.`);
		
		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: cmds },
		);

		console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	} catch (error) {
		console.error(error);
	}
})();

// Delete every slash command from the guild scope

// rest.put(Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID), { body: [] })
// 	.then(() => console.log('Successfully deleted all guild commands.'))
// 	.catch(console.error);