const fetch = require("node-fetch")
const DiscordJS = require("discord.js")
const fs = require("fs")
module.exports = {
    randommeme: {
        data: {
            name: "randommeme",
            description: "returns an amount of random memes",
            options: [
                {
                    name: "memeamount",
                    description: "amount of memes yo want. max 20 and cant be zero",
                    required: true,
                    type: 4,
                },
            ],
        },
        func: async (interaction) => {
            try {
                if (interaction.options.getInteger("memeamount") > 20 || interaction.options.getInteger("memeamount") <= 0){
                    throw console.error("meme amount is more than 20 or under zero");
                }
                let fetched = await fetch("https://meme-api.herokuapp.com/gimme/" + Number(interaction.options.getInteger("memeamount")) + "/")
                fetched = await fetched.json()
                interaction.reply("memes incoming")
                setTimeout(() => {
                    let currentResponse = "memez: "
                    let times = 0
                    for (let i in fetched.memes){
                        i = fetched.memes[i]
                        if (i.nsfw){
                            currentResponse = currentResponse + `[](https://tenor.com/view/breaking-bad-meme-swag-gif-23683094) `
                            times += 1
                        } else {
                            currentResponse = currentResponse + `[](${i.url}) `
                            times += 1
                        }
                        if (times > 4 || times === fetched.memes.length){
                            interaction.followUp(currentResponse)
                            times = 0
                            currentResponse = "memez: "
                        }
                    }
                }, 1000)
            } catch(err) {
                await interaction.reply("an error has occured: " + err)
            }
        }
    },
    setmemechannel: {
        data: {
            name: "setmemechannel",
            description: "sets the specified channel for memeposting every 2 minutes.",
            options: [
                {
                    name: "channel",
                    description: "self explainatory. the channel to set the meme channel as",
                    required: true,
                    type: 7
                },
            ],
        },
        func: async (interaction) => {
            if (!interaction.member.permissions.has("ADMINISTRATOR")){
                interaction.reply("Must have administrator to do this action")
                return
            }
            try {
                let jsonFile = fs.readFileSync("./memechannels.json")
                jsonFile = JSON.parse(jsonFile)
                jsonFile[interaction.options.getChannel("channel").id] = 1
                fs.writeFileSync("./memechannels.json", JSON.stringify(jsonFile))
                interaction.reply({
                    content: "Successfully set the channel for memeposting. A quick note before you go, It will check every 2 minutes if it can reply to the channel or not, if it cant reply to the channel 5 times, it will get decayed from the JSON. So make sure I have perms for that channel."
                })
            } catch(err) {
                interaction.reply({
                    content: "Error: " + err
                })
            }
        }
    },
    dox: {
        data: {
            name: "dox",
            description: "dox people",
            options: [
                {
                    name: "usertodox",
                    description: "self explainatory",
                    required: true,
                    type: 6
                }
            ]
        },
        func: async (interaction) => {
            try {
                let inter = await interaction.reply("doxxing <@" + interaction.options.getUser("usertodox") + "> ...")
                setTimeout(() => {
                    interaction.editReply("https://tenor.com/view/rickroll-roll-rick-never-gonna-give-you-up-never-gonna-gif-22954713")
                }, 3000)
            } catch(err) {
                interaction.reply("Error: " + err)
            }
        }
    }
}