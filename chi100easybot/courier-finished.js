const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const composer = require('telegraf/composer');
const util = require('./utils');
const {Markup} = require('telegraf');
const { sendCourier } = require('./services');

const sceneName = util.FINISH_SCENE_NAME;

const scene = new Scene(sceneName);

scene.enter(async ctx => {
    // TODO send collected data to the destination

    await sendCourier(ctx.session.data);

    ctx.scene.leave(sceneName);

});

scene.leave(ctx => {

    // ctx.reply(JSON.stringify(ctx.session.data));

    ctx.reply('Дякуємо за Ваше замовлення. Вся інформація зібрана та вислана. У найближчій час менеджер нашої компанії зв\'яжеться з Вами для уточнення деталей.', util.markupMenu());
});

module.exports = {
    finishScene: scene,
};
