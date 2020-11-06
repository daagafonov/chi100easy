const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const composer = require('telegraf/composer');
const util = require('./utils');
const {Markup} = require('telegraf');
const axios = require('axios');
const { getUserByTelegramID, updateUserPhone } = require('./services');

const {enter, leave} = Stage;

const sceneName = util.PHONENUMBER_SCENE_NAME;

const scene = new Scene(sceneName);

const next = async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.scene.enter(util.CLIENT_NAME_SCENE);
}

scene.enter(async ctx => {

    const user = await getUserByTelegramID(ctx);

    console.log(user.data);

    Object.assign(ctx.session.data, {
        userId: user.data._id
    });

    if (!user.data.hasOwnProperty('phoneNumber')) {
        ctx.replyWithMarkdown('Будь-ласка вкажіть Ваш номер телефону  або натисніть кнопку *Поділитися номером*',
            Markup.resize(true).oneTime(true).keyboard([[
                Markup.contactRequestButton('Поделиться номером')
            ], [
                Markup.button('Відміна')
            ]]).extra()
        );
    } else {
        // ctx.session.data.phoneNumber = user.data.phoneNumber;
        await next(ctx);
    }

});

scene.on('contact', async ctx => {

    const user = await getUserByTelegramID(ctx);

    ctx.session.data.phoneNumber = ctx.message.contact.phone_number;

    await updateUserPhone(ctx, user);

    await next(ctx);
});

// scene.leave((ctx) => ctx.reply(JSON.stringify(ctx.session.data)));

scene.hears('Відміна', async ctx => {
    await ctx.scene.leave(sceneName);
    ctx.reply('Ви скасували замовлення кур\'єра!', util.markupMenu());
});

scene.on('text', async ctx => {

    ctx.session.data.phoneNumber = ctx.message.text;

    await next(ctx);
});

module.exports = {
    phoneNumberScene: scene,
};
