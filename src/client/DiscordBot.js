const { Client, Collection, Partials } = require("discord.js");
const CommandsHandler = require("./handler/CommandsHandler");
const { warn, error, info, success } = require("../utils/Console");
const config = require("../config");
const CommandsListener = require("./handler/CommandsListener");
const ComponentsHandler = require("./handler/ComponentsHandler");
const ComponentsListener = require("./handler/ComponentsListener");
const EventsHandler = require("./handler/EventsHandler");
const { QuickYAML } = require('quick-yaml.db');

class DiscordBot extends Client {
    collection = {
        application_commands: new Collection(),
        message_commands: new Collection(),
        message_commands_aliases: new Collection(),
        components: {
            buttons: new Collection(),
            selects: new Collection(),
            modals: new Collection(),
            autocomplete: new Collection()
        }
    }
    rest_application_commands_array = [];
    login_attempts = 0;
    login_timestamp = 0;
    statusMessages = [
        { name: "Meow? Skidibi? What's the difference? Both are important.", type: 4 },
        { name: "I LOVE GAMBLING! ", type: 4 },
        { name: "AWH DANG IT!", type: 4 },
        { name: "Purring so hard, might turn into a skidibi factory.", type: 4 },
        { name: "I CANT STOP WINNING! 💵", type: 4 },
        { name: "Laser pointers? Check. Catnip? Check. Skidibi fuel? Essential.", type: 4 },
        { name: "Dreaming of a world where all treats are skidibi-flavored.", type: 4 },
        { name: "IM SO SIGMA 🐺", type: 4 },
        { name: "Planning my next mischief. Maybe a sock full of skidibi? Or maybe just a world tour.", type: 4 },
        { name: "Skidibi daa, patootie doo! Thinking about world domination... or maybe just a nap.", type: 4 },
        { name: "ALL ON BLACK", type: 4 },
        { name: "Purring so hard, might turn into a skidibi factory.", type: 4 },
        { name: "Laser pointers? Check. Catnip? Check. Skidibi fuel? Essential.", type: 4 },
        { name: "Dreaming of a world where all treats are skidibi-flavored.", type: 4 },
        { name: "Planning my next mischief. Maybe a sock full of skidibi? Or maybe just a world tour.", type: 4 },
        { name: "Skidibi daa, patootie doo! Thinking about world domination... or maybe just a nap.", type: 4 },
        { name: "Purring so hard, might turn into a skidibi factory.", type: 4 },
        { name: "Laser pointers? Check. Catnip? Check. Skidibi fuel? Essential.", type: 4 },
        { name: "Dreaming of a world where all treats are skidibi-flavored.", type: 4 },
        { name: "Planning my next mischief. Maybe a sock full of skidibi? Or maybe just a world tour.", type: 4 },
        { name: "I have unspoken Rizz", type: 4 },
        { name: "Erm What the Sigma", type: 4 },
        { name: "GET OUTTT", type: 4 },
        { name: "Im him", type: 4 },
        ];

    commands_handler = new CommandsHandler(this);
    components_handler = new ComponentsHandler(this);
    events_handler = new EventsHandler(this);
    database = new QuickYAML(config.database.path);

    constructor() {
        super({
            intents: 3276799,
            partials: [
                Partials.Channel,
                Partials.GuildMember,
                Partials.Message,
                Partials.Reaction,
                Partials.User
            ],
            presence: {
                activities: [{
                    name: 'keep this empty',
                    type: 4,
                    state: 'Life is Roblox'
                }]
            }
        });
        
        new CommandsListener(this);
        new ComponentsListener(this);
    }

    startStatusRotation = () => {
        let index = 0;
        setInterval(() => {
            this.user.setPresence({ activities: [this.statusMessages[index]] });
            index = (index + 1) % this.statusMessages.length;
        }, 7000);
    }

    connect = async () => {
        warn(`Attempting to connect to the Discord bot... (${this.login_attempts + 1})`);

        this.login_timestamp = Date.now();

        try {
            await this.login(process.env.CLIENT_TOKEN);
            this.commands_handler.load();
            this.components_handler.load();
            this.events_handler.load();
            this.startStatusRotation();

            warn('Attempting to register application commands... (this might take a while!)');
            await this.commands_handler.registerApplicationCommands(config.development);
            success('Successfully registered application commands. For specific guild? ' + (config.development.enabled ? 'Yes' : 'No'));
        } catch (err) {
            error('Failed to connect to the Discord bot, retrying...');
            error(err);
            this.login_attempts++;
            setTimeout(this.connect, 5000);
        }
    }
}

module.exports = DiscordBot;
