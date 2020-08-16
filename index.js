const Telegraf = require('telegraf');
const app = new Telegraf('1295128406:AAF7L0eXnImoPjIturGK0Fv8HMWxdtvaPyE');

app.start((ctx) => ctx.reply('Welcome!'))
app.help((ctx) => ctx.reply('Send me a sticker'))
app.on('sticker', (ctx) => ctx.reply('👍'))
app.hears('hi', (ctx) => ctx.reply('Hey there'))

app.command('oldschool', (ctx) => ctx.reply('Hello'))
app.command('modern', ({ reply }) => reply('Yo'))
app.command('hipster', Telegraf.reply('λ'))

app.launch()
