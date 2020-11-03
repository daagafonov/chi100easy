const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const composer = require('telegraf/composer');
const util = require('./utils');
const {Markup} = require('telegraf');
const {getUserAddresses} = require('./services');

const {enter, leave} = Stage;

const sceneName = util.ADDRESS_SCENE_NAME;

const next = async (ctx) => {
    await ctx.scene.leave(sceneName);
    ctx.scene.enter(util.TIME_SCENE_NAME);
}

const scene = new Scene(sceneName);
scene.enter(async ctx => {

    const addresses = await getUserAddresses(ctx.session.data.userId);

    if (addresses.data.length === 0) {
        ctx.replyWithMarkdown('Теперь я попрошу указать город, улицу, номер дома и квартиру где Вы встретите курьера',
            {
                parse_mode: "Markdown",
                reply_markup: {
                    one_time_keyboard: true,
                    resize_keyboard: true,
                    keyboard: [[{
                        text: "Отмена",
                    }]],
                }
            }
        );
    } else {

        // show list of already created addresses

        const bts = [];
        addresses.data.forEach(addr => {
            bts.push(Markup.callbackButton(addr.address, JSON.stringify({
                _id: addr._id
            })));
        });
        const buttons = Markup.inlineKeyboard(bts).extra();
        ctx.replyWithMarkdown('Пожалуйста выберите на какой адрес будет ехать курьер или введите новый адрес',
            buttons
        );
    }

});

// scene.leave((ctx) => ctx.reply(JSON.stringify(ctx.session.data)));

scene.hears('Отмена', async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.reply('Вы отменили заказ курьера!', util.markupMenu());
});

scene.on('text', async ctx => {

    Object.assign(ctx.session.data, {
        address: ctx.message.text
    });

    ctx.session.data.address = ctx.message.text;

    await next(ctx);

});

scene.on('callback_query', async ctx => {

    const data = JSON.parse(ctx.update.callback_query.data);

    ctx.session.data.addressId = data._id;

    await next(ctx);

});

module.exports = {
    addressScene: scene,
};
