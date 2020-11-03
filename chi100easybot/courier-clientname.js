const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const composer = require('telegraf/composer');
const util = require('./utils');

const {enter, leave} = Stage;

const sceneName = util.CLIENT_NAME_SCENE;

const scene = new Scene(sceneName);
scene.enter(ctx => {
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
});

// scene.leave((ctx) => ctx.reply(JSON.stringify(ctx.session.data)));

scene.hears('Отмена', async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.reply('Вы отменили заказ курьера!', util.markupMenu());
});

scene.on('text', ctx => {

    ctx.session.data.name = ctx.message.text;

    ctx.scene.leave(sceneName).then(res => ctx.scene.enter(util.ADDRESS_SCENE_NAME));

});

module.exports = {
    clientNameScene: scene,
};
