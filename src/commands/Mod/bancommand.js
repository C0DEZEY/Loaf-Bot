const { ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'ban',
        description: 'Ban a user from the server',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'User to ban',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'reason',
                description: 'Reason for the ban',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'length',
                description: 'Length of the ban (e.g., "7d" for 7 days)',
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
        // Check if the user executing the command has the proper permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
            return interaction.reply({ content: "You don't have permission to ban members.", ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const reason = interaction.options.getString('reason');
        const length = interaction.options.getString('length'); // You can parse this if you want to manage timed bans

        const member = interaction.guild.members.cache.get(targetUser.id);

        if (!member) {
            return interaction.reply({ content: "User not found in the guild.", ephemeral: true });
        }

        // Prevent banning admins or higher roles
        if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: "You cannot ban an administrator.", ephemeral: true });
        }

        try {
            // Ban the user
            await member.ban({ reason });
            
            interaction.reply({ content: `Banned ${targetUser.tag} for ${reason}. Length: ${length}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "An error occurred while trying to ban the user.", ephemeral: true });
        }
    }
}).toJSON();
