
# Loaf Bot

Loaf Bot is a versatile Discord bot designed to streamline task assignment and project management within your Discord server. In addition to task management, Loaf Bot includes various moderation tools to help keep your community organized and engaged.

## Features

- **Task Assignment:** Assign tasks to specific users or groups within your Discord server.
- **Moderation Tools:** Utilize moderation commands to manage your server effectively.
- **Customizable Prefix:** Set a custom prefix for message commands.
- **Application Commands:** Supports chat input, user context, and message context commands.
- **Developer-Friendly:** Configurable for development environments with guild-specific command registration.

## Setup

### Prerequisites

Before you start, make sure you have the following installed:

- **Node.js:** [Download Node.js](https://nodejs.org/)
- **Git:** (optional) [Download Git](https://git-scm.com/)

### Create a Discord Bot

1. Go to the [Discord Developer Portal](https://discord.com/developers/applications) and create a new application.
2. Under the "Bot" tab, add a bot to your application.
3. Copy the `CLIENT_TOKEN` from the bot page and save it for later.

### Environment Variables

To run this project, you will need to create a `.env` file in the root directory of your project with the following content:

```
CLIENT_TOKEN=your-bot-token
```

### Configuration

Create a `config.js` file in the root directory with the following structure:

```js
const config = {
    database: {
        path: './database.yml' // The database path.
    },
    development: {
        enabled: false, // If true, the bot will register all application commands to a specific guild (not globally).
        guildId: '', // Your development guild ID.
    },
    commands: {
        prefix: '?', // The prefix for message commands.
        message_commands: true, // Enable/disable message commands.
        application_commands: {
            chat_input: true, // Enable/disable chat input (slash) commands.
            user_context: true, // Enable/disable user context menu commands.
            message_context: true // Enable/disable message context menu commands.
        }
    },
    users: {
        ownerId: '', // Your Discord user ID.
        developers: ['', ''] // Array of developer IDs.
    },
    messages: { 
        NOT_BOT_OWNER: 'You do not have the permission to run this command because you\'re not the owner of me!',
        NOT_BOT_DEVELOPER: 'You do not have the permission to run this command because you\'re not a developer of me!',
        NOT_GUILD_OWNER: 'You do not have the permission to run this command because you\'re not the guild owner!',
        CHANNEL_NOT_NSFW: 'You cannot run this command in a non-NSFW channel!',
        MISSING_PERMISSIONS: 'You do not have the permission to run this command, missing permissions.',
        COMPONENT_NOT_PUBLIC: 'You are not the author of this button!',
        GUILD_COOLDOWN: 'You are currently in cooldown, you have the ability to re-use this command again in \`%cooldown%s\`.'
    }
}

module.exports = config;
```

### Database

Loaf Bot uses a `database.yml` file for storing data. You can create an empty `database.yml` file in the root directory to start.

## Deployment

To deploy Loaf Bot, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/your-username/loaf-bot.git
cd loaf-bot
```

2. Install the necessary packages:

```bash
npm install
```

3. Run the bot:

```bash
node .
```

## Acknowledgements

This project was built using the [Discord Bot Template](aa) and other open-source resources. Special thanks to the developers who contributed to the original code.

## Used By

This project is proudly used by the following game studio:

- **Morning Dove Development**

## Contributing

Contributions are welcome! If you would like to improve Loaf Bot, feel free to fork the repository and submit a pull request.

## License

This project is open-source and available under the MIT License.
