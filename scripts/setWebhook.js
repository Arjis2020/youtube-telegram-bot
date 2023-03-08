import axios from "axios"
import { config } from "dotenv"
config();

(async () => {
    const { data } = await axios.get(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT}/setWebhook?url=${process.env.CYCLIC_URL}`)
    console.log(data)
})()    