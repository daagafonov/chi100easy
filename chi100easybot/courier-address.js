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
        ctx.replyWithMarkdown('Тепер я прошу вказати місто, вулицю, номер будинку та квартиру де Ви зустрінете кур\'єра ',
            {
                parse_mode: "Markdown",
                reply_markup: {
                    one_time_keyboard: true,
                    resize_keyboard: true,
                    keyboard: [[{
                        text: "Відміна",
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
        ctx.replyWithMarkdown('Будь-ласка виберіть адресу на яку буде їхати кур\'єр , або вкажіть нову адресу ',
            buttons
        );
    }

});

// scene.leave((ctx) => ctx.reply(JSON.stringify(ctx.session.data)));

scene.hears('Відміна', async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.reply('Ви скасували замовлення кур\'єра!', util.mainMenu());
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
