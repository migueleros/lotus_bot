const { 
    SlashCommandBuilder,
    EmbedBuilder,
} = require('discord.js');

const axios = require('axios');

const request_profile = async (username) => {
    try {
        const res = await axios.get(`https://api.github.com/users/${username}`)
        return res.data
    }
    catch(err) {
        console.error(err)
    }
}

const request_repos = async (endpoint) => {
    try {
        const res = await axios.get(endpoint)
        return res.data
    }
    catch(err) {
        console.error(err)
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription("Show the user's github profile")
            .addStringOption(option =>
                option.setName('username')
                    .setDescription("Insert the desired username")
                    .setRequired(true)),
    async execute(interaction) {
        const profile_data = await request_profile(interaction.options.getString('username'))
        const repos_data = await request_repos(profile_data.repos_url)
    
        const profile_embed = new EmbedBuilder()
	        .setColor(000)
            .setAuthor({ 
                name: profile_data.login, 
                iconURL: profile_data.avatar_url, 
                url: profile_data.html_url 
            })
            .addFields(
                { name: '\ ', value: '\ '},
                { 
                    name: 'Name', 
                    value: profile_data.name ? profile_data.name : 'User does not have a name',
                },
                { name: '\ ', value: '\ '},
                { 
                    name: 'Bio',
                    value: profile_data.bio ? profile_data.bio : 'User does not have a bio.',
                },
                { name: '\ ', value: '\ '},
                {
                    name: 'Followers',
                    value: profile_data.followers.toString(),
                    inline: true
                },
                {
                    name: 'Following',
                    value: profile_data.following.toString(),
                    inline: true
                },
                { name: '\ ', value: '\ '},
                {
                    name: 'Popular Repositories:',
                    value: '\ ',
                },
            )
            .setFooter({ 
                text: `Requested by ${interaction.user.username}`, 
                iconURL: `https://cdn.discordapp.com/avatars/${interaction.user.id}/${interaction.user.avatar}`
            });
        
        for (let i = 1; i <= 2; i++) {
            if (repos_data.length < 2){
                profile_embed.addFields({ name: '\u200b', value: 'This user does not have any repositories..' })
                return
            }

            var popular = repos_data[0] 

            repos_data.forEach(repo => {
                if (repo.stargazers_count > popular.stargazers_count) {
                    popular = repo
                }
            })

            profile_embed.addFields(
                {
                    name: popular.name,
                    value: `
                        Description: ${popular.description ? popular.description : 'No description provided'}
                        Language: ${popular.language ? popular.language : 'No language provided'}
                        ${popular.stargazers_count} :star:
                    `,
                },
                { name: '\ ', value: '\ '},
            )

            repos_data.splice(repos_data.indexOf(popular), 1)
        }
            
        await interaction.reply({
            embeds: [ profile_embed ]
        });
    },
};