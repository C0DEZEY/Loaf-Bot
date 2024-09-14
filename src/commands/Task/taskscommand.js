const { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, ComponentType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const fs = require('fs');
const tasksFilePath = './tasks.json';

// Helper function to read JSON files
function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Helper function to write to JSON files
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Helper function to get the number of days between two dates
function daysUntil(deadline) {
    const currentDate = new Date();
    const taskDate = new Date(deadline);
    const timeDiff = taskDate - currentDate;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Helper function to generate a task embed for a specific user
function generateUserTasksEmbed(tasks, user, userId) {
    const userTasks = tasks[userId] || [];

    const embed = new EmbedBuilder()
        .setColor('#00AAFF')
        .setTitle(`${user.username}'s Tasks`)
        .setTimestamp();

    const taskList = userTasks.map((task, index) => {
        const warning = daysUntil(task.deadline) <= 3 && !task.isFinished ? '⚠️' : '';
        const priority = task.isHighPriority ? '⭐' : '';
        return `**${index + 1}.** ${task.task}\n**Deadline:** ${task.deadline}\n**Finished:** ${task.isFinished}\n**Priority:** ${priority} ${warning}`;
    }).join('\n\n');

    embed.setDescription(taskList || 'No tasks assigned');

    return embed;
}

module.exports = new ApplicationCommand({
    command: {
        name: 'tasks',
        description: 'Manage tasks for members',
        type: 1,
        options: [
            {
                name: 'add',
                description: 'Add a task for a user',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'user',
                        description: 'The user to assign the task to',
                        type: ApplicationCommandOptionType.User,
                        required: true
                    },
                    {
                        name: 'task',
                        description: 'The task description',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    },
                    {
                        name: 'deadline',
                        description: 'The deadline for the task (YYYY-MM-DD)',
                        type: ApplicationCommandOptionType.String,
                        required: true
                    }
                ]
            },
            {
                name: 'view_all',
                description: 'View tasks for all members',
                type: ApplicationCommandOptionType.Subcommand,
                options: []
            },
            {
                name: 'remove',
                description: 'Remove a task for a user',
                type: ApplicationCommandOptionType.Subcommand,
                options: [
                    {
                        name: 'user',
                        description: 'The user whose task you want to remove',
                        type: ApplicationCommandOptionType.User,
                        required: true
                    },
                    {
                        name: 'task_index',
                        description: 'The index of the task to remove',
                        type: ApplicationCommandOptionType.Integer,
                        required: true
                    }
                ]
            }
        ]
    },
    options: {
        cooldown: 5000,
        isAdmin: true
    },

    /**
     * 
     * @param {DiscordBot} client 
     * @param {ChatInputCommandInteraction} interaction 
     */
    run: async (client, interaction) => {
        const subcommand = interaction.options.getSubcommand();
        const tasks = readJsonFile(tasksFilePath);

        switch (subcommand) {
            case 'add': {
                const user = interaction.options.getUser('user');
                const taskDescription = interaction.options.getString('task');
                const deadline = interaction.options.getString('deadline');

                if (!tasks[user.id]) {
                    tasks[user.id] = [];
                }

                tasks[user.id].push({
                    task: taskDescription,
                    deadline: deadline,
                    isFinished: false,
                    isVerified: false,
                    isHighPriority: false
                });

                writeJsonFile(tasksFilePath, tasks);
                await interaction.reply({ content: `Task added for ${user.tag}: "${taskDescription}" (Deadline: ${deadline})` });
                break;
            }

            case 'view_all': {
                if (Object.keys(tasks).length === 0) {
                    await interaction.reply({ content: 'There are no tasks for any members!' });
                    return;
                }

                const userOptions = Object.keys(tasks).map(userId => {
                    const user = client.users.cache.get(userId);
                    return {
                        label: user ? user.username : userId,
                        value: userId
                    };
                });

                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('select_user')
                    .setPlaceholder('Select a user')
                    .addOptions(userOptions);

                const actionRow = new ActionRowBuilder().addComponents(selectMenu);

                const initialUserId = userOptions[0].value;
                const initialUser = client.users.cache.get(initialUserId);
                const initialEmbed = generateUserTasksEmbed(tasks, initialUser, initialUserId);

                const message = await interaction.reply({
                    embeds: [initialEmbed],
                    components: [actionRow],
                    fetchReply: true
                });

                const collector = message.createMessageComponentCollector({
                    componentType: ComponentType.StringSelect,
                    time: 60000 
                });

                collector.on('collect', async i => {
                    if (i.user.id !== interaction.user.id) {
                        await i.reply({ content: "This selection isn't for you!", ephemeral: true });
                        return;
                    }

                    const selectedUserId = i.values[0];
                    const selectedUser = client.users.cache.get(selectedUserId);
                    const updatedEmbed = generateUserTasksEmbed(tasks, selectedUser, selectedUserId);

                    await i.update({
                        embeds: [updatedEmbed]
                    });
                });

                collector.on('end', async () => {
                    await interaction.editReply({
                        components: []
                    });
                });

                break;
            }

            case 'remove': {
                const user = interaction.options.getUser('user');
                const taskIndex = interaction.options.getInteger('task_index');

                if (!tasks[user.id] || !tasks[user.id][taskIndex]) {
                    await interaction.reply({ content: 'Invalid task index or no tasks found for this user.', ephemeral: true });
                } else {
                    const removedTask = tasks[user.id].splice(taskIndex, 1);
                    writeJsonFile(tasksFilePath, tasks);
                    await interaction.reply({ content: `Task removed for ${user.tag}: "${removedTask[0].task}"` });
                }
                break;
            }

            default:
                await interaction.reply({ content: 'Unknown command!', ephemeral: true });
        }
    }
}).toJSON();
