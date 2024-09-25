const { ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'dice',
        description: 'Roll a die',
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
            const number = Math.floor(Math.random() * 6) + 1;
            await interaction.reply({ content: `You rolled a **${number}**!` });
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'An error occurred while executing the command.', ephemeral: true });
        }
    }
}).toJSON();
