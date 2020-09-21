const axios = require('axios');

// const path = require('path');
const http = require('http');
// const https = require('https');
const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');

const helmet = require("helmet");
const cors = require("cors");


const botServer = express();

const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');

require('custom-env').env(true);
console.log("node env ", process.env.NODE_ENV);

const api = require('./api');

const {leave} = Stage;
const stage = new Stage();

const Telegraf = require('telegraf');

botServer.use(morgan('tiny'));
botServer.use(fileUpload({
    // useTempFiles : true,
    limits: {fileSize: 50 * 1024 * 1024},
    // tempFileDir : '/tmp/',
    // debug: true,
}));
botServer.use(helmet());
botServer.use(cors());
botServer.use(express.json());

botServer.use('/bot', api);

let app;

app = new Telegraf(process.env.BOT_TOKEN);

// botServer.use(app.webhookCallback(`/${process.env.BOT_TOKEN}`));

// const webhook = `https://${process.env.EXTERNAL_SERVER_API}`;

// app.telegram.setWebhook(webhook);

// botServer.get(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
//     app.telegram.processUpdate(req.body);
//     res.sendStatus(200);
// });



http.createServer(botServer).listen(8080, () => {
    console.log('Example app listening on port 8080!')
});

const scanQR = new Scene('scanQR');
stage.register(scanQR);
const generate = new Scene('generate');
stage.register(generate);
const scanBarcode = new Scene('scanBarcode');
stage.register(scanBarcode);

app.use(session());
app.use(stage.middleware());


app.start((ctx) => {
    starter(ctx);
});
app.help((ctx) => ctx.reply('Send me a sticker'));

app.command('health', async (ctx) => {

    axios.get(`http://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_CONTEXT_PATH}/actuator/health`).then((response) => {

        console.log('%o', response.data);

        ctx.reply(JSON.stringify(response.data));

    }).catch((error) => {
        console.log(error);
    });

});

app.hears('Твой личный идентификатор', async (ctx) => {
    // ctx.scene.enter('generate');

    //ctx.replyWithChatAction('upload_photo');

    axios.get(`http://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(ctx.message.from.id)}&size=300x300`)
        .then(async (response) => {
            await ctx.replyWithPhoto(`http://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(ctx.message.from.id)}&size=300x300`, {caption: 'Generated via @chi100easybot'});
            //ctx.reply('You can send me another text or tap "⬅️ Back"');

            // updateStat('generating')
            // updateUser(ctx, true)
        })
        .catch(async (err) => {
            console.log(err);
            await ctx.reply('Data you sent isn`t valid. Please check that and try again.');
            // ctx.reply('You can send me another text or tap "⬅️ Back"')

            // sendError(`Generating error by message ${ctx.message.text}: \n\n ${err.toString()}`, ctx)
        });

});

app.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

// botServer().use(bodyParser.json());

// botServer.listen(process.env.PORT);

// botServer.post('/' + process.env.BOT_TOKEN, (req, res) => {
//
//     console.log(req);
//
//     app.processUpdate(req.body);
//     res.sendStatus(200);
// });
//
// https.createServer({
//     key: fs.readFileSync('./ssl/my-key.pem'),
//     cert: fs.readFileSync('./ssl/my-cert.pem'),
// }, botServer).listen(8443, () => {
//     console.log(`Example app listening on port 8443!`);
// })

// generate.enter((ctx) => {
//     ctx.reply(
//         'I`m ready. Send me text!',
//         { reply_markup: { keyboard: [['⬅️ Back']], resize_keyboard: true } }
//     )
// })
//
// generate.hears('⬅️ Back', (ctx) => {
//     starter(ctx)
//     ctx.scene.leave('generate')
// })

// generate.on('text', async (ctx) => {
//
//
// })

app.on("contact", async (ctx) => {
    console.log(ctx.message.contact);
    const userPayload = await axios.get(`http://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_CONTEXT_PATH}/users/byTelegramUserId/${ctx.message.from.id}`);

    console.log('incoming user', userPayload.data);

    axios.put(`http://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_CONTEXT_PATH}/users/${userPayload.data._id}/phoneNumber`, {
        phoneNumber: ctx.message.contact.phone_number,
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
});

app.on("location", async (ctx) => {

    console.log(ctx.message.location);

    const userPayload = await axios.get(`http://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_CONTEXT_PATH}/users/byTelegramUserId/${ctx.message.from.id}`);
    axios.put(`http://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_CONTEXT_PATH}/users/${userPayload.data._id}/location`, {
        longitude: ctx.message.location.longitude,
        latitude: ctx.message.location.latitude,
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
});

app.launch();

function starter(ctx) {

    axios.get(`http://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_CONTEXT_PATH}/users/byTelegramUserId/${ctx.message.from.id}`).then((response) => {

        console.log(response.data);

        buildStarterButtons(ctx);

    }).catch((err) => {
        axios.post(`http://${process.env.API_HOST}:${process.env.API_PORT}${process.env.API_CONTEXT_PATH}/users`, {
            firstName: ctx.message.from.first_name,
            lastName: ctx.message.from.last_name,
            username: ctx.message.from.username,
            telegramUserId: ctx.message.from.id,
            chatId: ctx.chat.id,
        }).then((response) => {

            console.log('created user ', response.data);

            buildStarterButtons(ctx);

        }).catch((err) => {
            console.error(err);
        });
    });
}

function buildStarterButtons(ctx) {
    ctx.replyWithMarkdown(
        'Привет! Выбери что бы ты хотел получить!',
        {
            reply_markup: {
                keyboard: [[{
                    text: 'Твой личный идентификатор',
                }, {
                    text: 'Поделиться своим номером',
                    request_contact: true,
                }], [{
                    text: 'Поделиться своим местоположением',
                    request_location: true,
                }]],
                resize_keyboard: true,
            }
        }
    );

}
