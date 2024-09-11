module.exports = new MessageCommand({
    command: {
        name: 'say',
        description: 'Bot says what you said',
        aliases: ['shush']
    },
    options: {
        botOwner: true
    },
    /**
     * 
     * @param {DiscordBot} client 
     * @param {Message} message 
     * @param {string[]} args
     */
    run: async (client, message, args) => {
    
            await message.reply({
                content: args
            });

    }
}).toJSON();