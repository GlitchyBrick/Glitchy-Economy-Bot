const Discord = require('discord.js')
const client = new Discord.Client();
const { MessageEmbed } = require('discord.js')
const { prefix, token } = require('./config.json')
const mongoose = require('mongoose')
const { connect } = require('mongoose')
const CooldownResponce = require('./Messages/CooldownResponce.json')
const settingsResponce = require('./Messages/SettingsResponce.json')
const settings = require('./settings.json')

//Cooldown
const cooldown = new Set(); //For Beg
const weeklycooldown = new Set();
const monthlycooldown = new Set();

//Mongoose Models
const BalModel = require('./models/bal')

client.on('ready', async () => {
    console.log('Ready!')

    await connect('mongodb+srv://Glitch:exbXGDQWjFoY4FwO@cluster0.hd5kc.mongodb.net/Data', {
        useNewUrlParser: true,
        useFindAndModify: false
    })

})

/*client.on("guildCreate", async function(guild){
    console.log(`the client joins a guild | ${guild.id}`);
    const doc = new MoneySignModel({id: guild.id});
    await doc.save();
    console.log('New Doc Has been Made Defult Symbol: ⏣')
});

client.on("guildDelete", async function(guild){
    console.log(`the client left a guild | ${guild.id}`);
    const doc = await MoneySignModel.findOneAndDelete({ id: guild.id });
    return console.log('deleted doc')
});*/

client.on('message', async message => {
    if(message.content === `${prefix}bal`) {
        if(settings.Enabled === false) {
            message.channel.send(settingsResponce.Enabled);
            return;
        }
    
        if(settings.Commands.EconomyCommands === false) {
            message.channel.send(settingsResponce.Commands.EconomyCommands);
            return;
        }

        if(settings.Economy.BalCommand === false) {
            message.channel.send(settingsResponce.Economy.BalCommand);
            return;
        }

        const req = await BalModel.findOne({id: message.author.id})
        if(!req) {
            const doc = new BalModel({id: message.author.id});
            await doc.save();
            message.reply('Please Try To Use a Command Again | This Happens Becuase its your first time using the econmy features')
        }
        const embed = new Discord.MessageEmbed()
        embed.setTitle(`**${message.author.username}\'s balance**`)
        embed.setDescription(`**Wallet**: ⏣ ${req.balence}\n**Bank**: SOON`)
        embed.setColor('RANDOM')
        embed.setFooter('😏')
        embed.setTimestamp()

        message.channel.send(embed)
    }

    if(message.content === `${prefix}beg`) {
        if(settings.Enabled === false) {
            message.channel.send(settingsResponce.Enabled);
            return;
        }
    
        if(settings.Commands.EconomyCommands === false) {
            message.channel.send(settingsResponce.Commands.EconomyCommands);
            return;
        }
        
        if(settings.Economy.BegCommand === false) {
            message.channel.send(settingsResponce.Economy.BegCommand);
            return;
        }

        if(cooldown.has(message.author.id)) {
            const embed = new Discord.MessageEmbed()
            embed.setTitle(CooldownResponce.Beg.Title)
            embed.setDescription(CooldownResponce.Beg.Description)
            embed.setColor(CooldownResponce.Beg.Color)

            message.channel.send(embed)
        } else {
            const req = await BalModel.findOne({id: message.author.id})

            //Responces
            /*const BegResponce = require('./Messages/BegResponce.json')
            var MrBeast = BegResponce.Responce1.Title
            var IndainTecSupport = BegResponce.Responce2.Title
            var Karen = BegResponce.Responce3
            var Disloin = BegResponce.Responce4
            var JeffBezoz = BegResponce.Responce5*/
            
            if(!req) {
                const doc = new BalModel({id: message.author.id});
                await doc.save();
                message.reply('Please Try To Use a Command Again | This Happens Becuase its your first time using the economy features')
            }
            
            let amounts = Math.floor(Math.random() * 500) + 1;
    
            const doc = await BalModel.findOneAndUpdate({ id: message.author.id }, { $inc: { balence:amounts} }, {new: true});
            message.reply('You Begged and Got ⏣ ' + amounts)

            cooldown.add(message.author.id);
            setTimeout(() => {
                cooldown.delete(message.author.id);
            }, CooldownResponce.Beg.BegCooldownSecs * 1000);
        }
    }

    if(message.content === `${prefix}daily`) {
        if(settings.Enabled === false) {
            message.channel.send(settingsResponce.Enabled);
            return;
        }
    
        if(settings.Commands.EconomyCommands === false) {
            message.channel.send(settingsResponce.Commands.EconomyCommands);
            return;
        }
        
        if(settings.Economy.DailyCommand === false) {
            message.channel.send(settingsResponce.Economy.DailyCommand)
            return;
        }

        if(weeklycooldown.has(message.author.id)) {
            const embed = new Discord.MessageEmbed()
            embed.setTitle(CooldownResponce.Daily.Title)
            embed.setDescription(CooldownResponce.Daily.Description)
            embed.setColor(CooldownResponce.Daily.Color)
            embed.setTimestamp()
            embed.setFooter('Daily Command')

            message.channel.send(embed)
        } else {
            const req = await BalModel.findOne({id: message.author.id})
            const DailyResponce = require('./Messages/DailyResponce.json')
            var dailyamount = 10000
            var dailyamount2 = '10,000'

            if(!req) {
                const doc = new BalModel({id: message.author.id});
                await doc.save();
                message.reply('Please Try To Use a Command Again | This Happens Becuase its your first time using the economy features')
            }

            const doc = await BalModel.findOneAndUpdate({ id: message.author.id }, { $inc: { balence:dailyamount} }, {new: true});
            const embed = new Discord.MessageEmbed()
            embed.setTitle(DailyResponce.Daily.Title + message.author.username)
            embed.setDescription('**⏣ ' + dailyamount2 + '** ' + DailyResponce.Daily.Description)
            embed.setColor(DailyResponce.Daily.Color)
            message.channel.send(embed)

            weeklycooldown.add(message.author.id);
            setTimeout(() => {
                weeklycooldown.delete(message.author.id);
            }, CooldownResponce.Daily.Cooldownsecs);
        }
    }

    if(message.content === `${prefix}monthly`) {
        if(settings.Enabled === false) {
            message.channel.send(settingsResponce.Enabled);
            return;
        }
    
        if(settings.Commands.EconomyCommands === false) {
            message.channel.send(settingsResponce.Commands.EconomyCommands);
            return;
        }
        
        if(settings.Economy.MonthlyCommand === false) {
            message.channel.send(settingsResponce.Economy.MonthlyCommand);
            return;
        }

        if(monthlycooldown.has(message.author.id)) {
            const embed = new Discord.MessageEmbed()
            embed.setTitle(CooldownResponce.Monthly.Title)
            embed.setDescription(CooldownResponce.Monthly.Description)
            embed.setColor(CooldownResponce.Monthly.Color)
            embed.setTimestamp()
            embed.setFooter('Monthly Command')

            message.channel.send(embed)
        } else {
            const req = await BalModel.findOne({id: message.author.id})
            const DailyResponce = require('./Messages/DailyResponce.json')
            var monthlyamount = 100000
            var monthlyamount2 = '100,000'

            if(!req) {
                const doc = new BalModel({id: message.author.id});
                await doc.save();
                message.reply('Please Try To Use a Command Again | This Happens Becuase its your first time using the economy features')
            }

            const doc = await BalModel.findOneAndUpdate({ id: message.author.id }, { $inc: { balence:monthlyamount} }, {new: true});
            const embed = new Discord.MessageEmbed()
            embed.setTitle(DailyResponce.Monthly.Title + message.author.username)
            embed.setDescription('**⏣ ' + monthlyamount2 + '** ' + DailyResponce.Monthly.Description)
            embed.setColor(DailyResponce.Monthly.Color)
            message.channel.send(embed)

            monthlycooldown.add(message.author.id);
            setTimeout(() => {
                monthlycooldown.delete(message.author.id);
            }, CooldownResponce.Monthly.Cooldownsecs);
        }
    }

    
})

client.login(token)