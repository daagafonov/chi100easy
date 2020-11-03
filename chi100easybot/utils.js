const {Markup} = require('telegraf');

const CLIENT_NAME_SCENE = 'clientname';
const ADDRESS_SCENE_NAME = 'address';
const TIME_SCENE_NAME = 'time';
const PHONENUMBER_SCENE_NAME = 'phonenumber';
const FINISH_SCENE_NAME = 'finish';

const menu = () => {
    return [[{ // first line
        text: "Зв`язатися зі мною",
        request_contact: true,
    }, {
        text: "Акції",
    }], [{ // second line
        text: "Наші точки приймання"
    }, {
        text: "Статус замовлення"
    }], [{ // third line
        text: "Викликати кур`єра",
    }, {
        text: "пусто"
    }]];
};

const markupMenu = () => {
    return Markup.resize(true).keyboard([[
        Markup.contactRequestButton('Зв`язатися зі мною'),
        Markup.button('Акції'),
    ], [
        Markup.button('Наші точки приймання'),
        Markup.button('Статус замовлення'),
    ], [
        Markup.button('Викликати кур`єра'),
        Markup.button('пусто'),
    ]]).extra();
};

module.exports = {
    CLIENT_NAME_SCENE,
    ADDRESS_SCENE_NAME,
    TIME_SCENE_NAME,
    PHONENUMBER_SCENE_NAME,
    FINISH_SCENE_NAME,

    markupMenu,

    menuButtons: menu
};
