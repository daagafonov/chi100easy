const axios = require('axios');

const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');

const { leave } = Stage;
const stage = new Stage();

const Telegraf = require('telegraf');
const app = new Telegraf('1295128406:AAF7L0eXnImoPjIturGK0Fv8HMWxdtvaPyE');

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

    axios.get('http://api:9000/chi100easy/api/actuator/health').then((response) => {

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
            await ctx.replyWithPhoto(`http://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(ctx.message.from.id)}&size=300x300`, { caption: 'Generated via @chi100easybot' });
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

app.on("contact", ctx => {
    console.log(ctx.message.contact);
    axios.put(`http://api:9000/chi100easy/api/users/${ctx.message.from.id}`, {
        phoneNumber: ctx.message.contact.phone_number,
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
});

app.on("location", ctx => {

    console.log(ctx.message.location);

    axios.put(`http://api:9000/chi100easy/api/users/${ctx.message.from.id}`, {
        longitude: ctx.message.location.longitude,
        latitude: ctx.message.location.latitude,
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
});

app.launch();

function starter (ctx) {

    axios.post("http://api:9000/chi100easy/api/users/create", {
        firstName: ctx.message.from.first_name,
        lastName: ctx.message.from.last_name,
        username: ctx.message.from.username,
        telegramUserId: ctx.message.from.id,
    }).then((response) => {

        console.log(response.data);

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

    }).catch((err) => {
        console.error(err);
    });
}
