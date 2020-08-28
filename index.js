const http = require("http");
const express = require("express");
const Server = require("./server.js");
const app = express();
const prefix = process.env.PREFIX;
app.get("/", (request, response) => {
  console.log(Date.now() + " Ping Received");
  response.sendStatus(200);
});
app.listen(process.env.PORT);

//requires discord module
const fs = require("fs");
const puppeteer = require("puppeteer");
const Discord = require("discord.js");
const client = new Discord.Client();
client.commands = new Discord.Collection();

//triggers once after the client logs in
client.once("ready", () => {
  console.log("Ready!");
  Server.get_status(function(result) {
      client.user.setActivity("The server is " + result, { type: "PLAYING"});
    });
});

setInterval(() => {
  Server.get_status(function(result) {
      client.user.setActivity("The server is " + result, { type: "PLAYING"});
    });
}, 24000);

client.on("message", message => {
  if (!message.content.startsWith(prefix)) return;
	const withoutPrefix = message.content.slice(prefix.length);
	const split = withoutPrefix.split(/ +/);
	const command = split[0];
	const args = split.slice(1);

  if (command == 'ping') {
    message.channel.send("I am alive");
  } else if (command == 'launch') {
    message.channel.send("Getting server status...");
    var status;
    try {
      Server.get_status(function(result) {
        status = result;
        message.channel.send(status);
        if (status == "Offline") {
          message.channel.send("Launching the server...");
          Server.start_server();
        } else if (status == "Online") {
          message.channel.send("Server is already online");
        } else {
          message.channel.send("Server status unknown!");
          message.channel.send("Attempting to start server anyways...");
          console.error("Server status not found");
          Server.start_server();
        }
      });
    } catch (err) {
      message.channel.send("An error occured, please try again, if the problem continues contact adam and tell him his code broke");
      console.log("start command");
      console.log(err);
    }

  } else if (command == 'status') {
    message.channel.send("Getting server status...");
    try {
      Server.get_status(function(result) {
        message.channel.send("The server is " + result);
      });
    } catch (err) {
      message.channel.send("An error occured, please try again, if the problem continues contact adam and tell him his code broke");
      console.error("status command");
      console.log(err);
    }

  } else if (command == 'players') {
    var players;
    message.channel.send("Getting players...");
    try {
      Server.get_status(function(result) {
        players = result;
        if (status == "Online") {
          players = Server.get_players();
        } else {
          players = 0;
        }

        message.channel.send("There are " + players +" players online");
      });
    } catch (err) {
      message.channel.send("An error occured, please try again, if the problem continues contact adam and tell him his code broke");
      conole.error("players");
      console.log(err);
    }

  } else if (command =='help') {
    const helpembed = {
      title: "Help List",
      description: "all commands need the prefix --",
      fields: [
        {
          name: "help",
          value: "displays this list"
        },
        {
          name: "ping",
          value: "checks if the bot is responding"
        },
        {
          name: "players",
          value: "gets the number of players "
        },
        {
          name: "launch",
          value: "starts the server"
        },
        {
          name: "status",
          value: "gets the servers status"
        }
      ]
    };
    message.channel.send({ embed: helpembed });
  } else {
    message.channel.send("Unknown command. Use --help for a list of commands");
  }
});

//login to discord as aternos bot use process.env.TOKEN when on glitch otherwise use token
client.login(process.env.TOKEN);
