const session = require("telegraf/session");
const Stage = require('telegraf/stage');
const Scene = require('telegraf/scenes/base');
const WizardScene = require('telegraf/scenes/wizard');
const composer = require('telegraf/composer');
const util = require('./utils');
const {Markup} = require('telegraf');

const sceneName = util.MY_ADDRESSES_SCENE_NAME;

const scene = new Scene(sceneName);
scene.enter(async ctx => {

    await ctx.reply('Адреса: ...');
    await ctx.scene.leave(sceneName);

});

module.exports = {
    myAddressesScene: scene,
};
