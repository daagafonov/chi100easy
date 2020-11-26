const Scene = require('telegraf/scenes/base');
const util = require('./utils');
const {Markup} = require('telegraf');
const {addUserAddress} = require('./services');

const sceneName = util.ADD_ADDRESS_SCENE_NAME;

const scene = new Scene(sceneName);
scene.enter(async ctx => {
    ctx.reply('Будь ласка, впишіть нову адресу у поле нижче', Markup.removeKeyboard(true).extra());
});

const next = async (ctx) => {
    await ctx.scene.leave(sceneName);
    ctx.scene.enter(util.MY_ADDRESSES_SCENE_NAME);
}

scene.on('text', async ctx => {

    const input = ctx.message.text;

    await addUserAddress(ctx.session.userId, input);

    await ctx.replyWithMarkdown(`Адреса <b>${input}</b> була добавлена до списку ваших адрес`, Markup.resize(true).extra({
        parse_mode: 'HTML'
    }));

    await next(ctx);

});

scene.hears('Вийти', async ctx => {
    await next(ctx);
});

module.exports = {
    addAddressScene: scene,
};
