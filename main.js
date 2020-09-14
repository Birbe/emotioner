let Discord = require("discord.js");

let mongoose = require("mongoose");

let connecting = mongoose.connect("mongodb://localhost/emotioner", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const Emotion = new mongoose.Schema({
    word: String,
    emotion: Boolean
});

connecting.then(async ()=>{
    let e = mongoose.model("Emotion", Emotion);

    await (new e({
        word: "arguments",
        emotion: true
    })).save();
});

let bot = new Discord.Client();

bot.on("message",async m=>{
    let e = mongoose.model("Emotion");

    let args = m.content.toLowerCase().split(" ");
    if(args[0] === "feel") {
        if(!args[1]) {
            m.channel.send("Arguments :)");
            return;
        }

        let entry = await e.findOne({
            word: args[1]
        });

        let emotion;

        if(!entry) {
            emotion = Math.random() >= 0.5;

            entry = new e({
                word: args[1],
                emotion
            });
            await entry.save();
        } else emotion = entry.emotion;

        m.channel.send(args[1].substr(0,1).toUpperCase()+args[1].substr(1)+(
            emotion ? " :)" : " :("
        ));
    }
});

bot.login(require("./config.json").token);