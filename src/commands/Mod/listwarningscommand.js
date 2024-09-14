const fs = require('fs');
const { ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

// Load warnings from the JSON file
let warnings = require("../../data/warnings.json");

module.exports = new ApplicationCommand({
    command: {
        name: 'listwarnings',
        description: 'List warnings for a user',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'User to view warnings for',
                type: ApplicationCommandOptionType.User,
                required: true
            }
        ]
    },
    options: {
        cooldown: 5000,
        isAdmin: true,
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
            return interaction.reply({ content: "You don't have permission to view warnings.", ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const guildId = interaction.guild.id;

        // Check if the guild or the user has any warnings
        if (!warnings[guildId] || !warnings[guildId][targetUser.id]) {
            return interaction.reply({ content: `${targetUser.tag} has no warnings.`, ephemeral: true });
        }

        const userWarnings = warnings[guildId][targetUser.id];

        // Create an embed or simple message to display the warnings
        let warningList = `Warnings for ${targetUser.tag}:\n\n`;

        userWarnings.forEach((warning, index) => {
            warningList += `**${index + 1}.** Reason: ${warning.reason}\nDate: ${warning.date}\n\n`;
        });

        // Send the warning list as a reply
        interaction.reply({ content: warningList, ephemeral: true });
    }
}).toJSON();
