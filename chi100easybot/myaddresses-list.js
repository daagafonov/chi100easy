const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const composer = require('telegraf/composer');
const util = require('./utils');
const {Markup} = require('telegraf');
const {getUserAddresses, getUserByTelegramID, removeAddress} = require('./services');

const sceneName = util.MY_ADDRESSES_SCENE_NAME;

const scene = new Scene(sceneName);
scene.enter(async ctx => {

    const user = await getUserByTelegramID(ctx);
    const addresses = await getUserAddresses(user.data._id);

    const lines = [];

    lines.push('Мої адреси:');

    addresses.data.forEach((addr, indx) => {
        scene.command(`address_${addr._id}`, ctx => {
            removeAddress(addr._id).then(response => {
                ctx.replyWithMarkdown(`Успішно видалена адреса *${addr.address}*.`);
            }).catch(error => {
                ctx.reply('Щось пішло не так...');
            });
        });

        lines.push(`${indx + 1}: *${addr.address}*. Видалити? - [/address_${addr._id}]`);
        lines.push('');
    });

    if (lines.length === 1) {
        lines.push('Не має жодкого зареєстрованого адресу.');
    }

    ctx.replyWithMarkdown(lines.join('\n'), Markup.resize(true).keyboard(['Завершити']).extra());

});

scene.hears('Завершити', async ctx => {
    await ctx.scene.leave(sceneName);
});

scene.leave(ctx => {
    ctx.reply('Выход из адресов', util.myProfileMenu());
});

module.exports = {
    myAddressesScene: scene,
};
