const Scene = require('telegraf/scenes/base');
const util = require('./utils');
const { getUserByTelegramID } = require('./services');

const sceneName = util.CLIENT_NAME_SCENE;

const next = async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.scene.enter(util.ADDRESS_SCENE_NAME);
}

const scene = new Scene(sceneName);
scene.enter(async ctx => {

    const user = await getUserByTelegramID(ctx);

    if (!user.data.alias) {
        ctx.replyWithMarkdown(`Будь-ласка вкажіть ПІБ`,
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

        ctx.session.data.alias = user.data.alias;
        await next(ctx);
    }

});

// scene.leave((ctx) => ctx.reply(JSON.stringify(ctx.session.data)));

scene.hears('Відміна', async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.reply('Ви скасували замовлення кур\'єра!', util.myActions());
});

scene.on('text', async ctx => {

    ctx.session.data.alias = ctx.message.text;

    await next(ctx);

});

module.exports = {
    clientNameScene: scene,
};
