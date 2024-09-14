const { ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionsBitField, TimeUnit } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");

module.exports = new ApplicationCommand({
    command: {
        name: 'timeout',
        description: 'Timeout a user from the server for a specific time',
        type: 1,
        options: [
            {
                name: 'user',
                description: 'User to timeout',
                type: ApplicationCommandOptionType.User,
                required: true
            },
            {
                name: 'duration',
                description: 'Duration of the timeout (e.g., 10m, 1h, 1d)',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'reason',
                description: 'Reason for the timeout',
                type: ApplicationCommandOptionType.String,
                required: false
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
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.ModerateMembers)) {
            return interaction.reply({ content: "You don't have permission to timeout members.", ephemeral: true });
        }

        const targetUser = interaction.options.getUser('user');
        const duration = interaction.options.getString('duration');
        const reason = interaction.options.getString('reason') || 'No reason provided';

        const member = interaction.guild.members.cache.get(targetUser.id);

        if (!member) {
            return interaction.reply({ content: "User not found in the guild.", ephemeral: true });
        }

        const msDuration = TimeUnit(duration); // Convert duration to milliseconds (you may need a library for this)
        
        try {
            await member.timeout(msDuration, reason);
            interaction.reply({ content: `Timed out ${targetUser.tag} for ${duration}. Reason: ${reason}`, ephemeral: true });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: "An error occurred while trying to timeout the user.", ephemeral: true });
        }
    }
}).toJSON();
