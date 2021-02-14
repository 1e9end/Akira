// Import environment variables
// provess.env. BOT_TOKEN, PREFIX, TEST_CHANNEL, MONGO_URI
require("dotenv").config();

const Discord = require('discord.js');
const { Client } = require('discord.js');
const client = new Client();
const cron = require('node-cron');

const d = require('./lib');
// const rr = require('./rr');
const commands = require('./commands');
const actions = require('./actions');

// One time things here
client.on("ready", ()=> {
	console.log(`${client.user.tag} logged in`);
	client.user.setPresence({
        status: "online",
        activity: {
            name: `${process.env.PREFIX}help`,
            type: "PLAYING"
        }
    });
});

/**
cron.schedule('* * * * *', function() {
	try{
		// client.channels.cache.get(process.env.TEST_CHANNEL).send("CRON SCHEDULING ON HEROKU?");
	}
	catch(e){
		console.log(e);
	}

  	console.log('Running a task every minute');
});
**/

client.on("message", async function(message){
	if (message.author.bot) {
		return;
	}
	console.log(`[${message.author.tag}]: ${message.content}`);

	var msg = d.parseMessage(message.content, message.guild.id, async function(msg, prefix){
		// console.log(msg);
		if (!msg || msg[0] == ""){
			return;
		}
		if (msg[0] == "hello" || msg[0] == "hi" || msg[0] == "yo" || msg[0] == "hey"){
			commands.hello(message);
			return;
		}

		if (msg[0] == "prefix"){
			commands.prefix(message, msg[1]);
			return;
		}

		if (msg[0] == "help"){
			commands.help(message, msg, prefix);
			return;
		}

		if (msg[0] == "poke" || msg[0] == "hug" || msg[0] == "kiss" || msg[0] == "cuddle" || msg[0] == "pat" || msg[0] == "slap"){
			var person = message.mentions.members.first();
			if (!person){
				message.channel.send("Please mention a valid user to " + msg[0]);
				return;
			}
			actions.parseAction(message, msg[0], person);
			
			return;
		}

		message.channel.send("Please use valid command.\nTo view all commands, type " + process.env.PREFIX + "help");
	});
});

client.on("messageDelete", (message)=> {
	var text = message.content;
	console.log(`[${message.author.tag}] deleted: ${text}`);
	for (var i = 0; i < text.length; ++i){
		if (text[i] == "@"){
			// Check further for ghost ping...

			// If ghost ping, send...
			message.channel.send(`Ghost ping detected! How shameful of you, <@${message.author.id}>...`);
		}
	}
});

// Connect to Discord API gateway
client.login(process.env.BOT_TOKEN);