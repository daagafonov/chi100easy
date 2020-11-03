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
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const composer = require('telegraf/composer');

const util = require('./utils');

const shared = require('./shared');

require('custom-env').env(true);
console.log("node env ", process.env.NODE_ENV);

const api = require('./api');

const Telegraf = require('telegraf');
const {Markup} = require('telegraf');

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
//
// const scanQR = new Scene('scanQR');
// stage.register(scanQR);
// const generate = new Scene('generate');
// stage.register(generate);
// const scanBarcode = new Scene('scanBarcode');
// stage.register(scanBarcode);

const {enter, leave} = Stage;


// // Greeter scene
// const greeterScene = new Scene('greeter')
// greeterScene.enter((ctx) => ctx.reply('Hi'))
// greeterScene.leave((ctx) => ctx.reply('Bye'))
// greeterScene.hears('hi', enter('greeter'))
// greeterScene.command('back', leave());
// greeterScene.on('message', (ctx) => ctx.replyWithMarkdown('Send `hi`'))
//
// // Echo scene
// const echoScene = new Scene('echo')
// echoScene.enter((ctx) => ctx.reply('echo scene'))
// echoScene.leave((ctx) => ctx.reply('exiting echo scene'))
// echoScene.command('back', leave())
// echoScene.on('text', (ctx) => ctx.reply(ctx.message.text))
// echoScene.on('message', (ctx) => ctx.reply('Only text messages please'))


// const stepHandler = new Composer();
// const create = new WizardScene('create',
//     (ctx) => {
//         ctx.reply('Этап 1: выбор типа матча.',
//             {reply_markup: {remove_keyboard: true}});
//
//         ctx.session.type = ctx.message.text;
//
//         return ctx.wizard.next(); // Переходим к следующему обработчику.
//     },
//     (ctx) => {
//         ctx.reply('Этап 2: выбор времени проведения матча.');
//         return ctx.wizard.next(); // Переходим к следующему обработчику.
//     },
//     (ctx) => {
//         if (ctx.message.text === "Назад") {
//             ctx.wizard.back(); // Вернуться к предыдущиму обработчику
//         }
//         ctx.reply('Этап 3: выбор места проведения матча.');
//         return ctx.wizard.next(); // Переходим к следующему обработчику.
//     },
//     (ctx) => {
//         ctx.reply('Финальный этап: создание матча.');
//         return ctx.scene.leave();
//     }
// );


// const menu = () => {
//     return [[{ // first line
//         text: "Зв`язатися зі мною",
//         request_contact: true,
//     }, {
//         text: "Акції",
//     }], [{ // second line
//         text: "Наші точки приймання"
//     }, {
//         text: "Статус замовлення"
//     }], [{ // third line
//         text: "Викликати кур`єра",
//     }, {
//         text: "пусто"
//     }]];
// };


// const addressScene = new WizardScene('address',
//     ctx => {
//         ctx.replyWithMarkdown('Пожалуйста укажите город',
//             {
//                 parse_mode: "Markdown",
//                 reply_markup: {
//                     one_time_keyboard: true,
//                     keyboard: [[{
//                         text: "",
//                     }]],
//                 }
//             }
//         );
//         return ctx.wizard.next();
//     },
//     ctx => {
//         ctx.reply('теперь улицу');
//     },
//     ctx => {
//         ctx.reply('а сейчас номер дома');
//     },
//     ctx => {
//         ctx.reply('квартиру');
//     },
//     ctx => {
//         return ctx.wizard.leave();
//     }
// );

const { phoneNumberScene } = require('./courier-phonenumber');
const { clientNameScene } = require('./courier-clientname');
const { addressScene } = require('./courier-address');
const { timeScene } = require('./courier-time');
const { finishScene } = require('./courier-finished');


// const callCourierGuy = new Scene('courier');
// callCourierGuy.enter(async ctx => {
//     await ctx.replyWithMarkdown('Форма вызова курьера. Введите улицу, номер дома и квартиру...',
//         {
//             parse_mode: "Markdown",
//             reply_markup: {
//                 one_time_keyboard: true,
//                 keyboard: [[{
//                     text: "⬅️ Выйти",
//                 }]],
//             }
//         }
//     );
//
// });
// callCourierGuy.leave((ctx) => ctx.reply('До свидания!'));
//
// callCourierGuy.hears('⬅️ Выйти', ctx => {
//     ctx.reply('hears back work', {
//         reply_markup: {
//             keyboard: menu(),
//         }
//     }).then(resp => {
//        ctx.scene.leave('courier');
//     });
// });
//
// callCourierGuy.on('text', ctx => {
//     ctx.reply(`Вы запросили курьера по адресу г. Киев, ${ctx.message.text}. Все верно?`, {
//         // reply_to_message_id: ctx.message.message_id,
//         reply_markup: {
//             inline_keyboard: [[{
//                 text: 'Да',
//                 callback_data: JSON.stringify({
//                     state: "confirmed",
//                     address: `г. Киев, ${ctx.message.text}`
//                 })
//             }, {
//                 text: 'Нет',
//                 callback_data: JSON.stringify({
//                     state: "declined",
//                     address: `г. Киев, ${ctx.message.text}`
//                 })
//             }]],
//         }
//     });
// });
//
// callCourierGuy.on('callback_query', ctx => {
//     const callbackQuery = ctx.update.callback_query;
//     const callbackData = JSON.parse(callbackQuery.data);
//     console.log(callbackData);
//
//     switch (callbackData.state) {
//         case 'confirmed':
//
//             ctx.reply(`Вы подтвердили вызов курьера по адресу ${callbackData.address}`);
//
//             break;
//         case 'declined':
//
//             ctx.reply('Отменяется заказ курьра...');
//
//             ctx.scene.leave('courier');
//
//             break;
//     }
// });


const stage = new Stage();

stage.register(
    phoneNumberScene,
    clientNameScene,
    addressScene,
    timeScene,
    finishScene,
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


// app.command("create", (ctx) => ctx.scene.enter("create"));


app.start((ctx) => {
    starter(ctx);
});
app.help((ctx) => ctx.reply('Send me a sticker'));

app.command('health', async (ctx) => {

    axios.get(`${process.env.API_URI}/actuator/health`).then((response) => {

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
//
// generate.on('text', async (ctx) => {
//
//
// })

app.on("contact", async (ctx) => {

    const user = await axios.get(`${process.env.API_URI}/users/byTelegramUserId/${ctx.message.from.id}`);

    axios.put(`${process.env.API_URI}/users/${user.data._id}/phoneNumber`, {
        phoneNumber: ctx.message.contact.phone_number,
    }).then(async (response) => {

        const result = await axios.post(`${process.env.API_URI}/service/callme`, {
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

app.on("location", async (ctx) => {

    const userPayload = await axios.get(`${process.env.API_URI}/users/byTelegramUserId/${ctx.message.from.id}`);
    axios.put(`${process.env.API_URI}/users/${userPayload.data._id}/location`, {
        longitude: ctx.message.location.longitude,
        latitude: ctx.message.location.latitude,
    }).then((response) => {
        console.log(response.data);
    }).catch((error) => {
        console.error(error);
    });
});

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
            }).catch(async (error) => {
                await ctx.reply('Order was already confirmed');
            });
            break;
        case "decline":
            axios.post(`${process.env.API_URI}/orders/${callbackData.order_id}/decline`, {}).then(async response => {
                await ctx.reply('GOOD guy', {
                    reply_markup: {
                        remove_keyboard: true,
                    },
                    disable_notification: true,
                });
            }).catch(async (error) => {
                await ctx.reply('Order was already declined');
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

    await ctx.replyWithMarkdown("Доступні опції:", {
        reply_markup: {
            //one_time_keyboard: true,
            keyboard: util.menuButtons(),
        },
    });

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
    axios.get(`${process.env.API_URI}/offers/allAvailable`).then(response => {

        const offers = response.data;

        console.log(offers);

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

    }).catch(error => {
        console.error(err);
    });
});

app.hears('Викликати кур`єра', ctx => {
    ctx.inlineQuery
});


app.launch();

function starter(ctx) {

    axios.get(`${process.env.API_URI}/users/byTelegramUserId/${ctx.message.from.id}`).then((response) => {
        buildStarterButtons(ctx);
    }).catch((err) => {
        axios.post(`${process.env.API_URI}/users`, {
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
                    // }, {
                    //     text: 'Поделиться своим номером',
                    //     request_contact: true,
                    //
                    // }], [{
                    //     text: 'Поделиться своим местоположением',
                    //     request_location: true,
                }]],
                resize_keyboard: true,
            }
        }
    );

    axios.get(`${process.env.API_URI}/offers/firstAvailable`).then(response => {

        const offer = response.data;

        ctx.replyWithHTML('Зараз діє така Акція:').then(response => {
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
                }).then(response => {

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
