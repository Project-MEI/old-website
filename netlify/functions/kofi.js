
const express = require('express');
const serverless = require('serverless-http');
const app = express();
const bodyParser = require('body-parser');
const { Webhook, MessageBuilder } = require('discord-webhook-node');
const webhook_url = process.env.WEBHOOK_LINK

const webhook = new Webhook(webhook_url); //Declaring the Webhook here

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', async function(req, res) {
	const data = req.body.data;
	console.log(req.body.data)

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

    res.json({message: "Ko-Fi Server is online!"});
    return;
});

module.exports.handler = serverless(app);