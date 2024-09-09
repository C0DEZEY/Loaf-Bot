
## Loaf Bot

A discord bot made to assgin tasks to discord users for a project and differnt mod tools! 



## Deployment
Requires Node 

To deploy this project run

Requires a .env  file, config.js, and a database.yml (Can be empty) 

```bash
  npm install
  node . 
```


## Acknowledgements

 - [Discord Bot Template](https://awesomeopensource.com/project/elangosundar/)

## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`CLIENT_TOKEN`

It also  needs a config being 
```js
const config = {
    database: {
        path: './database.yml' // The database path.
    },
    development: {
        enabled: false, // If true, the bot will register all application commands to a specific guild (not globally).
        guildId: '',
    },
    commands: {
        prefix: '?', // For message commands, prefix is required. This can be changed by a database.
        message_commands: true, // If true, the bot will allow users to use message (or prefix) commands.
        application_commands: {
            chat_input: true, // If true, the bot will allow users to use chat input (or slash) commands.
            user_context: true, // If true, the bot will allow users to use user context menu commands.
            message_context: true // If true, the bot will allow users to use message context menu commands.
        }
    },
    users: {
        ownerId: '', // The bot owner ID, which is you.
        developers: ['', ''] // The bot developers, remember to include your account ID with the other account IDs.
    },
    messages: { // Messages configuration for application commands and message commands handler.
        NOT_BOT_OWNER: 'You do not have the permission to run this command because you\'re not the owner of me!',
        NOT_BOT_DEVELOPER: 'You do not have the permission to run this command because you\'re not a developer of me!',
        NOT_GUILD_OWNER: 'You do not have the permission to run this command because you\re not the guild owner!',
        CHANNEL_NOT_NSFW: 'You cannot run this command in a non-NSFW channel!',
        MISSING_PERMISSIONS: 'You do not have the permission to run this command, missing permissions.',
        COMPONENT_NOT_PUBLIC: 'You are not the author of this button!',
        GUILD_COOLDOWN: 'You are currently in cooldown, you have the ability to re-use this command again in \`%cooldown%s\`.'
    }
}

module.exports = config;

```
## Used By

This project is used by the following the game studio:

- Morning Dove Development

