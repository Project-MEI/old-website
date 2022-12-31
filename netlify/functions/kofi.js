//Calling out modules
const express = require("express");
const app = express();
const http = require('http');
const bodyParser = require('body-parser');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const config = process.env;

if(!config) {
    console.error('Config file not found.');
    process.exit(1);
};
if(!config.WEBHOOK_LINK || !config.SERVER_PORT) {
    console.error('Config file missing items. Please regenerate');
    process.exit(1);
};

const webhook = new Webhook(config.WEBHOOK_LINK); //Declaring the Webhook here

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/post', async function(req, res) {
    const data = req.body.data;
    if (!data) return;

    try {
        const obj = JSON.parse(data);
        const embed = new MessageBuilder();
        embed.setTitle('New Ko-Fi Supporter!');
        embed.setColor(2730976);
        embed.addField(`From`, `${obj.from_name}`, true);
        embed.addField(`Amount`, `${obj.amount}`, true);
        embed.addField(`Message`, `${obj.message}`);
        embed.setTimestamp();
        await webhook.send(embed);
    } catch (err) {
        console.error(err);
        return res.json({success: false, error: err});
    }
    return res.json({success: true});
});


app.use('/', async function(req, res) { //Handiling requests to the main endpoint
    res.json({message: "Ko-Fi Server is online!"});
    return;
});

const httpServer = http.createServer(app); //Setting up the server
httpServer.listen(config.SERVER_PORT, function() {
  console.log(`Ko-Fi Server online on port ${config.SERVER_PORT}`);
});