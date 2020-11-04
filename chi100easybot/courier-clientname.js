const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const composer = require('telegraf/composer');
const util = require('./utils');
const { getUserByTelegramID } = require('./services');

const {enter, leave} = Stage;

const sceneName = util.CLIENT_NAME_SCENE;

const next = async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.scene.enter(util.ADDRESS_SCENE_NAME);
}

const scene = new Scene(sceneName);
scene.enter(async ctx => {

    const user = await getUserByTelegramID(ctx);

    if (!user.data.alias) {
        ctx.replyWithMarkdown(`Пожалуйста введите ФИО`,
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

        ctx.session.data.alias = user.data.alias;
        await next(ctx);
    }

});

// scene.leave((ctx) => ctx.reply(JSON.stringify(ctx.session.data)));

scene.hears('Отмена', async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.reply('Вы отменили заказ курьера!', util.markupMenu());
});

scene.on('text', async ctx => {

    ctx.session.data.alias = ctx.message.text;

    await next(ctx);

});

module.exports = {
    clientNameScene: scene,
};
