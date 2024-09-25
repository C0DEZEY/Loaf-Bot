const { ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: '8ball',
        description: 'Get a random answer from the magic 8-ball',
        type: 1,
        options: []
    },
    options: {
        cooldown: 1000,
        isAdmin: false,
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
        answers = ['It is certain', 'It is decidedly so', 'Without a doubt', 'Yes definitely', 'You may rely on it', 'As I see it, yes', 'Most likely', 'Outlook good', 'Yes', 'Signs point to yes', 'Reply hazy, try again', 'Ask again later', 'Better not tell you now', 'Cannot predict now', 'Don\'t count on it', 'My sources say no', 'Very doubtful'];
        const randomAnswer = answers[Math.floor(Math.random() * answers.length)];
        await interaction.reply({ content: `The magic 8-ball says: **${randomAnswer}**` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
        }
    }
}).toJSON();
