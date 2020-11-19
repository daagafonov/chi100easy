const Scene = require('telegraf/scenes/base');
const util = require('./utils');
const {Markup} = require('telegraf');

const sceneName = util.TIME_SCENE_NAME;

const scene = new Scene(sceneName);
scene.enter(async ctx => {
    await ctx.replyWithMarkdown('Вкажіть в якій частині дня Вам буде зручно передати речі?',
        {
            parse_mode: "Markdown",
            reply_markup: {
                one_time_keyboard: true,
                resize_keyboard: true,
                remove_keyboard: true,
                inline_keyboard: [[{
                    text: "9:00 - 13:00",
                    callback_data: JSON.stringify({
                        state: '1'
                    })
                }, {
                    text: '13:00 - 17:00',
                    callback_data: JSON.stringify({
                        state: '2'
                    })
                }, {
                    text: '17:00 - 21:00',
                    callback_data: JSON.stringify({
                        state: '3'
                    })
                }]]
            }
        }
    );
    await ctx.replyWithMarkdown('Нажміть `Відміна` щоб скасувати виклик кур\'ра', Markup.resize(true).keyboard([[
        Markup.button('Відміна')
    ]]).extra());
});

scene.hears('Відміна', async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.reply('Ви скасували замовлення кур\'єра!', util.myActions());
});

scene.on('callback_query', async ctx => {
    const callbackQuery = ctx.update.callback_query;
    const callbackData = JSON.parse(callbackQuery.data);
    console.log(callbackData);

    ctx.session.data.time = callbackData.state
    await ctx.scene.leave(sceneName);
    ctx.scene.enter(util.FINISH_SCENE_NAME);
});

module.exports = {
    timeScene: scene,
};
