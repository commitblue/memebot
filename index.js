const {Client, GatewayIntentBits} = require("discord.js")
const commandsModule = require("./modules/commands.js")
const fetch = require("node-fetch")
const fs = require("fs")
require("dotenv").config()
function multithread(func){
    const timeout = setTimeout(func, 0)
    return {
        cancel: () => {
            clearTimeout(timeout)
        }
    }
}
const client = new Client({
    intents: [GatewayIntentBits.GuildMessages, GatewayIntentBits.Guilds]
})
client.on("ready", () => {
    const guild = client.application
    let commands = guild.commands
    console.log("ready!")
    for (const [_, command] of Object.entries(commandsModule)){
        commands.create(command.data)
    }
    function memepostingLoop(){
        const json = require("./memechannels.json")
        let fetched = fetch("https://meme-api.herokuapp.com/gimme/")
        .then(fetcheded => {
            fetched = fetcheded.json()
        })
        for (let [r, v] of Object.entries(json)){
            i = client.channels.cache.get(r)
            if (v > 5){
                delete json[r]
                fs.writeFileSync("./memechannels.json", JSON.stringify(json))
            } else {
                i.send({
                    content: i.nsfw && "https://tenor.com/view/breaking-bad-meme-swag-gif-23683094" || i.url
                })
                .then(() => {
                    console.log("sent")
                })
                .catch((err) => {
                    console.log("Error = " + err)
                    json[r] += 1
                    fs.writeFileSync("./memechannels.json", JSON.stringify(json))
                })
            }
        }
        setTimeout(memepostingLoop, 6000)
    }
    multithread(() => {
        memepostingLoop()
    })
})
client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()){
        return
    }
    const fetchedCommand = commandsModule[interaction.commandName]
    if (fetchedCommand){
        await fetchedCommand.func(interaction)
    }
})
client.login(process.env.token)