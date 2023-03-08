import { Bot, webhookCallback, InputFile } from "grammy";
import express from "express";
import { config } from "dotenv";
import ytdl from "ytdl-core";
import { MemoryWriter, MemoryWriterStream, readFromMemory } from "./utils/memory.js";

config()

const bot = new Bot(process.env.TELEGRAM_BOT)

bot.command('audio', async (message) => {
    const url = message.match
    const chatId = message.chat.id

    if (ytdl.validateURL(url)) {
        const mw = new MemoryWriterStream(chatId)

        await bot.api.sendMessage(chatId, "Received your request. Please wait for a couple of minutes. This shouldn't take long :)")
        const info = await ytdl.getInfo(url)
        const title = info.videoDetails.title

        const registration = ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio'
        }).pipe(mw)
        console.log("registered...")
        // registration.on('error', (err) => console.log(err))
        // registration.on('close', () => console.log("closed"))
        // registration.on('pause', () => console.log("paused"))
        // registration.on('readable', () => console.log("readable"))
        // registration.on('resume', () => console.log("resume"))
        // registration.on('data', function (chunk) {
        //     console.log("data")
        //     mw.writeChunk(chunk)
        // })
        registration.on('end', async function () {
            console.log("done!")
            await bot.api.sendAudio(chatId, new InputFile(readFromMemory(chatId), title))
            mw.close()
        })
    }
    else {
        await bot.api.sendMessage(chatId, 'Invalid URL! Please send a valid URL.')
    }
})

if (process.env.NODE_ENV === 'production') {
    const app = express()
    const PORT = process.env.PORT || 9000

    app.use(express.json())
    app.use(webhookCallback(bot, 'express'))

    app.listen(PORT, () => {
        console.log(`Bot is listening on PORT ${PORT}`)
    })
}
else {
    bot.start()
}