const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('hello')
		.setDescription("What is up?"),
	async execute(interaction) {
		await interaction.reply(`What is up, ${interaction.user.username.toLowerCase()}?`);
	},
};