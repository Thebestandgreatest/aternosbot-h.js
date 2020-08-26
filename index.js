const http = require("http");
const express = require("express");
const Server = require("./server.js");
const app = express();
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
  http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`);
  Server.get_status(function(result) {
      client.user.setActivity("The server is " + result, { type: "PLAYING"});
    });
}, 240000);

client.on("message", message => {
  if (message.content === "--ping") {
    console.log("ping");
    message.channel.send("I am alive");
  } else if (message.content === "--launch") {
    console.log("launch");
    message.channel.send("Getting server status...");
    var status;
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
  } else if (message.content === "--status") {
    console.log("status");
    message.channel.send("Getting server status...");
    Server.get_status(function(result) {
      message.channel.send("The server is " + result);
    });
  } else if (message.content === "--players") {
    console.log("players");
    var players;
    message.channel.send("Getting players...");
    Server.get_status(function(result) {
      players = result;
      if (status == "Online") {
        players = Server.get_players();
      } else {
        players = 0;
      }

      message.channel.send("There are " + players +" players online");
    });
  } else if (message.content === "--help") {
    console.log("help");
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
  }
});

//login to discord as aternos bot use process.env.TOKEN when on glitch otherwise use token
client.login(process.env.TOKEN);
