import ytdl from 'ytdl-core';
import TelegramBot from 'node-telegram-bot-api';
import { MemoryWriter, readFromMemory } from './utils/memory.js';

import { config } from 'dotenv'
config()

const TELEGRAM_BOT = process.env.TELEGRAM_BOT;
console.log(TELEGRAM_BOT)

const bot = new TelegramBot(TELEGRAM_BOT, { polling: true, filepath: false })

bot.onText(/\/audio (.+)/, async (message, match) => {
    const url = match[1]
    const chatId = message.chat.id

    if (ytdl.validateURL(url)) {
        const mw = new MemoryWriter(chatId)

        await bot.sendMessage(chatId, "Received your request. Please wait for a couple of minutes. This shouldn't take long :)")
        const info = await ytdl.getInfo(url)
        const title = info.videoDetails.title

        const registration = ytdl(url, {
            filter: 'audioonly'
        })
        registration.on('data', function (chunk) { mw.writeChunk(chunk) })
        registration.on('end', async function () {
            await bot.sendAudio(chatId, readFromMemory(chatId), {
                title
            }, {
                contentType: 'audio/mpeg'
            })
            mw.close()
        })
    }
    else {
        await bot.sendMessage(chatId, 'Invalid URL! Please send a valid URL.')
    }
})

bot.on('message', (message) => {
    console.log(message.chat.id)
})