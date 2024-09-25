const fs = require('fs');
const { ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

// Load warnings from the JSON file
let warnings = require("./warnings.json");

// Helper function to save warnings back to the file
const saveWarnings = () => {
    fs.writeFileSync(warnings, JSON.stringify(warnings, null, 2));
};

module.exports = new ApplicationCommand({
    command: {
        name: 'warn',
        description: 'Warn a user for inappropriate behavior',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'User to warn',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'reason',
                description: 'Reason for the warning',
                type: ApplicationCommandOptionType.String,
                required: true
            },
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

        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const guildId = interaction.guild.id;

        if (!warnings[guildId]) {
            warnings[guildId] = {};
        }
        if (!warnings[guildId][targetUser.id]) {
            warnings[guildId][targetUser.id] = [];
        }
        warnings[guildId][targetUser.id].push({
            reason: reason,
            date: new Date().toISOString()
        });

        // Save the updated warnings to the JSON file
        saveWarnings();

        // Send a confirmation message
        interaction.reply({ content: `Warned ${targetUser.tag} for: ${reason}`, ephemeral: true });
        try {
            await targetUser.send(`You have been warned for: ${reason}`);
        } catch (error) {
            console.log("Couldn't send DM to the user. They might have DMs off.");
        }
    }
}).toJSON();
