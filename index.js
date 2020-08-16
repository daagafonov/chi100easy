const Telegraf = require('telegraf');
const app = new Telegraf('1295128406:AAF7L0eXnImoPjIturGK0Fv8HMWxdtvaPyE');

app.hears('hi', ctx => {
 return ctx.reply('Hey!');
});

app.command('start', ctx => {
 console.log(JSON.stringify(ctx));
});

app.startPolling();
