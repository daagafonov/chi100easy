const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const composer = require('telegraf/composer');
const util = require('./utils');

const {enter, leave} = Stage;

const sceneName = util.TIME_SCENE_NAME;

const scene = new Scene(sceneName);
scene.enter(ctx => {
    ctx.replyWithMarkdown('Вкажіть в якій половині дня Вам буде зручно передати речі?',
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
});

// scene.leave((ctx) => ctx.reply(JSON.stringify(ctx.session.data)));

// scene.hears('Відміна', async ctx => {
//     await ctx.scene.leave(sceneName);
//     ctx.reply('Ви скасували замовлення кур\'єра!', util.markupMenu());
// });

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
