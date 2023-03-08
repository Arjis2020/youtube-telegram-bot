import { Bot, webhookCallback, InputFile } from "grammy";
import express from "express";
import { config } from "dotenv";
import ytdl from "ytdl-core";
import { MemoryWriter, MemoryWriterStream, readFromMemory } from "./utils/memory.js";
import axios from "axios";

config()

const bot = new Bot(process.env.TELEGRAM_BOT)

bot.command('audio', async (message) => {
    const url = message.match
    const chatId = message.chat.id

    if (ytdl.validateURL(url)) {
        const mw = new MemoryWriterStream(chatId)

        await message.reply("Received your request. Please wait for a couple of minutes. This shouldn't take long :)")
        const info = await ytdl.getInfo(url)
        const title = info.videoDetails.title

        ytdl(url, {
            filter: 'audioonly',
            quality: 'highestaudio'
        })
            .pipe(mw)
            .on('finish', async function () {
                await message.replyWithAudio(new InputFile(readFromMemory(chatId), title))
                mw.close()
            })
    }
    else {
        await message.reply('Invalid URL! Please send a valid URL.')
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