const Scene = require('telegraf/scenes/base');
const util = require('./utils');
const {Markup} = require('telegraf');
const {getUserAddresses} = require('./services');

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

            const tmp = [];

            tmp.push(Markup.callbackButton(addr.address, JSON.stringify({
                _id: addr._id
            })));

            bts.push(tmp);
        });
        const buttons = Markup.inlineKeyboard(bts).extra();
        await ctx.replyWithMarkdown('Будь-ласка виберіть адресу на яку буде їхати кур\'єр , або вкажіть нову адресу ',
            buttons
        );
        await ctx.replyWithMarkdown('Нажміть `Відміна` щоб скасувати виклик кур\'ра', Markup.resize(true).keyboard([[
            Markup.button('Відміна')
        ]]).extra());
    }

});

// scene.leave((ctx) => ctx.reply(JSON.stringify(ctx.session.data)));

scene.hears('Відміна', async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.reply('Ви скасували замовлення кур\'єра!', util.myActions());
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
