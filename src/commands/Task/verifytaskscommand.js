const { ChatInputCommandInteraction, ApplicationCommandOptionType, PermissionsBitField } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const fs = require('fs');
const tasksFilePath = './tasks.json';
const usersFilePath = './users.json';

// Helper function to read JSON files
function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Helper function to write to JSON files
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

module.exports = new ApplicationCommand({
    command: {
        name: 'verifytasks',
        description: 'Verify tasks and add XP to users (Admin/Dev/Owner only)',
        type: 1,
        options: [
            {
                name: 'userid',
                description: 'The user ID of the person whose tasks you want to verify',
                type: ApplicationCommandOptionType.String,
                required: true
            },
            {
                name: 'task_index',
                description: 'The index of the task to verify',
                type: ApplicationCommandOptionType.Integer,
                required: true
            }
        ]
    },
    options: {
        cooldown: 5000
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const userId = interaction.options.getString('userid');
        const taskIndex = interaction.options.getInteger('task_index');

        const tasks = readJsonFile(tasksFilePath);
        const users = readJsonFile(usersFilePath);

        // Check if the user has admin permissions
        if (!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
        }

        // Check if the user and task exist
        if (!tasks[userId] || !tasks[userId][taskIndex]) {
            return interaction.reply({ content: 'Invalid user ID or task index.', ephemeral: true });
        }

        const task = tasks[userId][taskIndex];

        if (task.isVerified) {
            return interaction.reply({ content: 'This task is already verified.', ephemeral: true });
        }

        // Mark the task as verified
        task.isVerified = true;
        task.isFinished = true; // Optionally mark it as finished too
        writeJsonFile(tasksFilePath, tasks);

        // Add XP to the user
        if (!users[userId]) {
            users[userId] = { xp: 0 };
        }

        users[userId].xp += 10; // Adjust XP value as needed
        writeJsonFile(usersFilePath, users);

        await interaction.reply({ content: `Task verified successfully and 10 XP added to user ${userId}!` });
    }
}).toJSON();
