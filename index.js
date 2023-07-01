const { Client, Intents, MessageEmbed } = require('discord.js');

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

const guildId = TODO: add guild id;

client.on('ready', () => {
	console.log('Ready!');
	const guild = client.guilds.cache.get(guildId);
	let commands;
	if (guild) {
		commands = guild.commands;
	} else {
		commands = client.application?.commands;
	}
	
	commands?.create({
		name: 'poll',
		description: 'Generates poll.',
		options: [
			{
				name: 'question',
				description: `"[question]" "[choice_A]" "[choice_B]" ...`,
				required: true,
				type: 3
			}
		]
	})
});

async function sendMsg(reaction, user, msg) {
	if (user.bot) return;
	if (reaction.message.partial) {
		try {
			await reaction.message.fetch();
		} catch (error) {
			console.error('Something went wrong when fetching the message: ', error);
		}
	}
	let refAuthor = reaction.message.author;
	let refContent = reaction.message.content;
	if (reaction.message.author.bot) {
		if (reaction.message.interaction != null) {
			refAuthor = reaction.message.interaction.user;
			refAuthor.send({content: `${msg} in ${reaction.message.channel}\n<${reaction.message.url}>`, embeds: [reaction.message.embeds[0]]});
			return;
		} else {
			return;
		}
	}
	console.log(`${user.username} "${reaction.emoji.name}".`);
	refAuthor.send(`${msg} in ${reaction.message.channel}\n<${reaction.message.url}>\n"${refContent}"`);
}

async function poll(interaction, option) {
	strip = str => str.substring(1, str.length - 1);
	opt = n => ":regional_indicator_" + String.fromCharCode(96 + n, 58, 32);
	
	let alphabet = ["🇦", "🇧", "🇨", "🇩", "🇪", "🇫", "🇬", "🇭", "🇮", "🇯", "🇰", "🇱", "🇲", "🇳", "🇴", "🇵", "🇶", "🇷", "🇸", "🇹", "🇺", "🇻", "🇼", "🇽", "🇾", "🇿"];

	let args = option.match(/".*?"/g);
	if (args == null)
		args = [option];
	else 
		args[0] = strip(args[0]);

	let choices = "";
	for (let i = 1; i < args.length; ++i) {
		choices += "\n" + opt(i) + strip(args[i]);
	}

	const embedPoll = new MessageEmbed()
	.setTitle(args[0])
	.setDescription(choices)
	.setColor('#65381e')
	
	const msg = await interaction.reply({
		ephemeral: false,
		embeds: [embedPoll], 
		fetchReply: true,
	})

	for (let i = 0; i < args.length-1; ++i) {
		msg.react(alphabet[i]);
	}
}

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isCommand()) return;

	const {commandName, options} = interaction;

	if (commandName == 'poll') {
		poll(interaction, options.getString('question'));
	}
})

client.on('messageReactionAdd', async (reaction, user) => {
	sendMsg(reaction, user, `${user.username} reacted with "${reaction.emoji.name}"`);
});

client.on('messageReactionRemove', async (reaction, user) => {
	sendMsg(reaction, user, `${user.username} removed their "${reaction.emoji.name}" reaction`);
});

client.login(TODO: add login token);
