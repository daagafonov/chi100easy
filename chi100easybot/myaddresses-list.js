const Scene = require('telegraf/scenes/base');
const util = require('./utils');
const {Markup} = require('telegraf');
const {getUserAddresses, getUserByTelegramID, removeAddress} = require('./services');

const sceneName = util.MY_ADDRESSES_SCENE_NAME;

const scene = new Scene(sceneName);

const next = async (ctx) => {
    await ctx.scene.leave();
    ctx.scene.enter(util.ADD_ADDRESS_SCENE_NAME);
}

scene.enter(async ctx => {

    const user = await getUserByTelegramID(ctx);

    ctx.session.userId = user.data._id;

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

    ctx.replyWithMarkdown(lines.join('\n'), Markup.resize(true).keyboard(['Додати адресу', 'Завершити']).extra());

});

scene.hears('Додати адресу', async ctx => {
    // ctx.session.addAddress = true;
    // ctx.replyWithMarkdown('Зараз, будь ласка, впишіть нову адресу у поле ніжче', {
    //     parse_mode: 'HTML'
    // });

    await next(ctx);
});

scene.hears('Завершити', async ctx => {
    // await ctx.scene.leave(sceneName);
    ctx.scene.leave();
});

scene.leave(ctx => {
    ctx.reply('Вихід', util.myProfileMenu());
});

module.exports = {
    myAddressesScene: scene,
};
