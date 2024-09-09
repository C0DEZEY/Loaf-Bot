const { ChatInputCommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require("discord.js");
const DiscordBot = require("../../client/DiscordBot");
const ApplicationCommand = require("../../structure/ApplicationCommand");
const fs = require('fs');
const tasksFilePath = './tasks.json';

// Helper function to read JSON files
function readJsonFile(filePath) {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

// Helper function to get the number of days between two dates
function daysUntil(deadline) {
    const currentDate = new Date();
    const taskDate = new Date(deadline);
    const timeDiff = taskDate - currentDate;
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
}

// Helper function to generate task embeds for a user
function generateTaskEmbeds(tasks, userId) {
    const userTasks = tasks[userId] || [];

    // Sort tasks by deadline
    userTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));

    const embeds = userTasks.map((task, index) => {
        const warning = daysUntil(task.deadline) <= 3 && !task.isFinished ? '⚠️' : '';
        const priority = task.isHighPriority ? '⭐' : '';

        return new EmbedBuilder()
            .setColor('#00AAFF')
            .setTitle(`Task ${index + 1}/${userTasks.length}`)
            .setDescription(`**Task:** ${task.task}\n**Deadline:** ${task.deadline}\n**Finished:** ${task.isFinished}\n**Priority:** ${priority} ${warning}`)
            .setTimestamp();
    });

    return embeds;
}

module.exports = new ApplicationCommand({
    command: {
        name: 'mytasks',
        description: 'View your current tasks',
        type: 1,
        options: []
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
        const tasks = readJsonFile(tasksFilePath);
        const userId = interaction.user.id;
        const userTasks = tasks[userId] || [];

        if (userTasks.length === 0) {
            await interaction.reply({ content: 'You have no tasks assigned.', ephemeral: true });
            return;
        }

        const embeds = generateTaskEmbeds(tasks, userId);
        let currentPage = 0;

        const actionRow = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('prev')
                    .setLabel('Previous')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(currentPage === 0),
                new ButtonBuilder()
                    .setCustomId('next')
                    .setLabel('Next')
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(embeds.length === 1)
            );

        const message = await interaction.reply({
            embeds: [embeds[currentPage]],
            components: [actionRow],
            fetchReply: true
        });

        const collector = message.createMessageComponentCollector({
            componentType: ComponentType.Button,
            time: 60000 // 1 minute collector
        });

        collector.on('collect', async i => {
            if (i.user.id !== interaction.user.id) {
                await i.reply({ content: "These buttons aren't for you!", ephemeral: true });
                return;
            }

            if (i.customId === 'prev') {
                currentPage = Math.max(currentPage - 1, 0);
            } else if (i.customId === 'next') {
                currentPage = Math.min(currentPage + 1, embeds.length - 1);
            }

            await i.update({
                embeds: [embeds[currentPage]],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId('prev')
                                .setLabel('Previous')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === 0),
                            new ButtonBuilder()
                                .setCustomId('next')
                                .setLabel('Next')
                                .setStyle(ButtonStyle.Primary)
                                .setDisabled(currentPage === embeds.length - 1)
                        )
                ]
            });
        });

        collector.on('end', async () => {
            await interaction.editReply({
                components: []
            });
        });
    }
}).toJSON();
