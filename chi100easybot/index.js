const axios = require('axios');

const http = require('http');

const express = require('express');
const morgan = require('morgan');
const fileUpload = require('express-fileupload');
const FormData = require('form-data');

const helmet = require("helmet");
const cors = require("cors");
const fs = require('fs');
const tmp = require('./tmp');

const botServer = express();

const session = require("telegraf/session");
const Stage = require('telegraf/stage');
// const Scene = require('telegraf/scenes/base');
// const WizardScene = require('telegraf/scenes/wizard');
// const composer = require('telegraf/composer');

const util = require('./utils');
const services = require('./services');

const {authStorage} = require('./shared');

require('custom-env').env(true);
console.log("node env ", process.env.NODE_ENV);

const api = require('./api');

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

// app.use(async (ctx, next) => {
//     const start = new Date()
//     await next()
//     const ms = new Date() - start
//     console.log('Response time: %sms', ms)
// })
//
// app.on('text', (ctx) => ctx.reply('Hello World'))

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

const { phoneNumberScene } = require('./courier-phonenumber');
const { clientNameScene } = require('./courier-clientname');
const { addressScene } = require('./courier-address');
const { timeScene } = require('./courier-time');
const { finishScene } = require('./courier-finished');
const { myAddressesScene } = require('./myaddresses-list');

const stage = new Stage();

stage.register(
    phoneNumberScene,
    clientNameScene,
    addressScene,
    timeScene,
    finishScene,

    myAddressesScene,
);

stage.command('cancel', (ctx) => {
    return ctx.scene.leave();
});

app.use(session());
app.use(stage.middleware());

app.command('courier', ctx => {
    //ctx.scene.enter('courier');
    ctx.scene.enter(util.CLIENT_NAME_SCENE);
});
app.hears('Викликати кур`єра', ctx => {
    ctx.session.data = {};
    ctx.scene.enter(util.PHONENUMBER_SCENE_NAME);
});

app.hears('Чисто Просто', async (ctx) => {
    const lines = [];
    lines.push('1. *Наші точки приймання* - переглянути список всіх локацій де вас приймуть та обігріють ;-) ');
    lines.push('2. *Акції* - переглянути всі дійсні акції');
    ctx.replyWithMarkdown(lines.join('\n'), util.chi100EasyMenu());
});

app.hears('Мій профіль', ctx => {

    const lines = [];

    lines.push('Мій профіль:');
    lines.push('1. *Мої адреси* - тут ви можете переглянути всі свої зареєстровані адреси');
    lines.push('2. *Бонусний рахунок* - показує скільки ви накопичили балів на данний час');
    lines.push('3. *Мій ЧистоПросто ID* - генерує QR вашого ID');

    ctx.replyWithMarkdown(lines.join('\n'), util.myProfileMenu());
});

app.hears('Мої адреси', async ctx => {
    ctx.scene.enter(util.MY_ADDRESSES_SCENE_NAME);
});
app.command('myaddresses', (ctx) => {
    ctx.scene.enter(util.MY_ADDRESSES_SCENE_NAME);
});

// app.on('poll', ctx => {
//     console.log(JSON.stringify(ctx.update.poll));
// });

app.start((ctx) => {
    starter(ctx);
});

app.help((ctx) => ctx.reply('Send me a sticker'));

const myid = async (ctx) => {
    await axios.get(`http://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(ctx.message.from.id)}&size=300x300`)
    await ctx.replyWithPhoto(`http://api.qrserver.com/v1/create-qr-code/?data=${encodeURI(ctx.message.from.id)}&size=300x300`, {
        caption: 'Generated via @chi100easybot',
    });
    ctx.reply('Мій ЧистоПросто ID', util.myProfileMenu());
};

app.hears('Мій ЧистоПросто ID', async (ctx) => {
    myid(ctx);
});

app.command('myid', async (ctx) => {
    myid(ctx);
});

app.catch((err, ctx) => {
    console.log(`Ooops, encountered an error for ${ctx.updateType}`, err);
});

app.on("contact", async (ctx) => {

    const user = await axios.get(`${process.env.API_URI}/users/byTelegramUserId/${ctx.message.from.id}`);

    axios.put(`${process.env.API_URI}/users/${user.data._id}/phoneNumber`, {
        phoneNumber: ctx.message.contact.phone_number,
    }).then(async () => {

        await axios.post(`${process.env.API_URI}/service/callme`, {
            name: userCaption(user.data),
            phone: ctx.message.contact.phone_number,
        }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        ctx.reply('Очікуйте. З вами зв`яжуться.', {
            reply_to_message_id: ctx.message.message_id,
        });

    }).catch((error) => {
        console.error(error);
    });
});

// app.on("location", async (ctx) => {
//
//     const userPayload = await axios.get(`${process.env.API_URI}/users/byTelegramUserId/${ctx.message.from.id}`);
//     axios.put(`${process.env.API_URI}/users/${userPayload.data._id}/location`, {
//         longitude: ctx.message.location.longitude,
//         latitude: ctx.message.location.latitude,
//     }).then((response) => {
//         console.log(response.data);
//     }).catch((error) => {
//         console.error(error);
//     });
// });

app.on('callback_query', async (ctx) => {

    const callbackQuery = ctx.update.callback_query;
    const callbackData = JSON.parse(callbackQuery.data);
    console.log(callbackData);

    switch (callbackData.action) {
        case "confirm":
            axios.post(`${process.env.API_URI}/orders/${callbackData.order_id}/confirm`, {}).then(async response => {

                console.log('confirm 1', response);

                if (response.data.ok) {
                    await ctx.reply(response.data.invoiceUrl, {
                        reply_markup: {
                            inline_keyboard: [],
                            remove_keyboard: true,
                        },
                        disable_notification: true,
                    });
                } else {
                    await ctx.reply(response.data.message, {
                        reply_markup: {
                            inline_keyboard: [],
                            remove_keyboard: true,
                        },
                        disable_notification: true,
                    });
                }
            }).catch(async () => {
                await ctx.reply('Order was already confirmed');
            });
            break;
        case "decline":
            axios.post(`${process.env.API_URI}/orders/${callbackData.order_id}/decline`, {}).then(() => {
                ctx.reply('GOOD guy', {
                    reply_markup: {
                        remove_keyboard: true,
                    },
                    disable_notification: true,
                });
            }).catch(() => {
                ctx.reply('Order was already declined');
            });
            break;
    }
});

const userCaption = (user) => {
    if (!user.firstName) {
        return user.username;
    } else {
        return `${user.firstName} ${user.lastName}`;
    }
};

app.hears('Меню', async (ctx) => {
    await ctx.replyWithMarkdown("Доступні опції:", util.mainMenu());
});


app.hears('Наші точки приймання', ctx => {

    const map = [{
        title: 'Київ, вул. Васильківська, 3',
        latitude: 50.396033,
        longitude: 30.5061647,
        tel: '+380673202777',
        plusCode: '9GW4+F9 Киев',
    }, {
        title: 'Київ, вул. Уляни Громової, 5',
        latitude: 50.4191024,
        longitude: 30.4732924,
        tel: '+380962050007',
        plusCode: 'CF9F+H8 Киев',
    }];

    const lines = [];

    lines.push('*Наші точки приймання:*');
    lines.push('');


    map.forEach((address, index) => {
        lines.push(`*${index + 1}. ${address.title}*`);
        lines.push(`тел. ${address.tel}`);
        lines.push(`[На карті](https://www.google.com/maps/place/${encodeURIComponent(address.plusCode)}/@${address.latitude},${address.longitude},16z)`);
        lines.push(' ');
    });

    ctx.replyWithMarkdown(lines.join('\n'), {
        parse_mode: "Markdown",
        disable_web_page_preview: false,
    });

});

app.hears('Акції', async (ctx) => {
    services.getAllAvailable().then(response => {

        const offers = response.data;

        const lines = [];

        lines.push('Діючі акції:');
        lines.push(' ');

        offers.forEach((offer, index) => {
            lines.push(`*${index + 1} ${offer.shortDescription}*`);
            lines.push(`${offer.longDescription}`);
            lines.push(`[Детальніше](${process.env.SITE_URI}/offers?offerid=${offer._id})`);
            lines.push(' ');
        });

        ctx.replyWithMarkdown(lines.join('\n'), {
            parse_mode: "Markdown"
        });

    }).catch(() => {
        console.error(err);
    });
});

const bonus = async (ctx) => {
    const user = await axios.get(`${process.env.API_URI}/users/byTelegramUserId/${ctx.message.from.id}`)
    ctx.reply(`На вашому бонусному рахунку ${user.data.bonus} грн.`, util.myProfileMenu());
};

app.hears('Бонусний рахунок', (ctx) => {
    bonus(ctx);
});

app.command('bonus', (ctx) => {
    bonus(ctx);
});

app.hears('Головне меню', async (ctx) => {
    ctx.reply('Головне меню', util.mainMenu());
});

app.launch().then(() => {

    axios.post(`${process.env.API_URI}/auth/login`, {
        email: process.env.API_ADMIN_USER,
        password: process.env.API_ADMIN_PASSWORD,
    }).then(response => {
        if (response.data.ok) {
            authStorage.auth = response.data.accessToken;
        }
    }).catch(error => {
        console.log(error.response);
    });

});

function starter(ctx) {

    services.getUserByTelegramID(ctx).then(() => {
        buildStarterButtons(ctx);
    }).catch(() => {
        services.createUser({
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
        'Доброго дня! 😊\n' +
        'Вас вітає Бот компанії «Чисто Просто». Тут ви можете скористатися такими послугами:\n' +
        '✅Офорлювати та сплачувати замовлення\n' +
        '✅Отримувати бонуси\n' +
        '✅Дізнаватися про діючі Акції\n' +
        '✅Замовляти зворотній зв‘язок\n' +
        '✅Оцінювати роботу нашої компанії\n',
        {
            parse_mode: "HTML",
            reply_markup: {
                keyboard: [[{
                    text: 'Меню',
                }]],
                resize_keyboard: true,
            }
        }
    );

    services.findFirstAvailable().then(response => {

        const offer = response.data;

        ctx.replyWithHTML('Зараз діє така Акція:').then(() => {
            axios.get(`${process.env.API_URI}/offers/${offer._id}/image`, {
                responseType: 'arraybuffer'
            }).then(resp => {

                const filename = tmp.tmpFile('offer.image', 'img');

                fs.writeFileSync(filename, Buffer.from(resp.data, 'binary'));

                const form = new FormData();
                form.append('photo', fs.createReadStream(filename));
                form.append('chat_id', ctx.chat.id);
                form.append('caption', `${offer.longDescription}`);

                axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, form, {
                    headers: form.getHeaders()
                }).then(() => {

                    fs.unlinkSync(filename);

                    ctx.replyWithHTML(`<a href="${process.env.SITE_URI}/offers?offerid=${offer._id}"><b>Детальніше тут</b></a>`);

                }).catch(error => {
                    console.log(error);
                });

            }).catch(error => {
                console.log(error);
            });
        });

    }).catch((error) => {
        console.log(error.response.data);
    });

}
