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

    await ctx.reply('Мои адреса:', Markup.keyboard([{
        text: 'Завершить',
    }]).extra());

    const user = await getUserByTelegramID(ctx);
    const addresses = await getUserAddresses(user.data._id);

    const lines = [];

    addresses.data.forEach((addr, indx) => {
        scene.command(`address_${addr._id}`, ctx => {
            removeAddress(addr._id).then(response => {
                ctx.replyWithMarkdown(`Успешно удален адрес *${addr.address}*.`);
            }).catch(error => {
                ctx.reply('Щось пішло не так...');
            });
        });

        lines.push(`${indx + 1}: *${addr.address}*. Удалить? - [/address_${addr._id}]`);
        lines.push('');
    });

    ctx.replyWithMarkdown(lines.join('\n'));

});

scene.hears('Завершить', async ctx => {
    await ctx.scene.leave(sceneName);
});

scene.leave(ctx => {
    ctx.reply('Выход из адресов', util.markupMenu());
});

module.exports = {
    myAddressesScene: scene,
};
