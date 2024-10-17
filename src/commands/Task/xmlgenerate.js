const { ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'xml',
        description: '',
        type: 1,
        options: []
    },
    options: {
        cooldown: 1000,
        isAdmin: true,
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        try {
            const result = Math.random() < 0.5? 'Heads' : 'Tails';
            await interaction.reply({ content: `coin landed on ${result}.` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
        }
    }
}).toJSON();
