const {Markup} = require('telegraf');

const CLIENT_NAME_SCENE = 'clientname';
const ADDRESS_SCENE_NAME = 'address';
const TIME_SCENE_NAME = 'time';
const PHONENUMBER_SCENE_NAME = 'phonenumber';
const FINISH_SCENE_NAME = 'finish';
const MY_ADDRESSES_SCENE_NAME = 'myaddresses';


const markupMenu = () => {
    return Markup.resize(true).keyboard([[
        Markup.contactRequestButton('Зв`язатися зі мною'),
        Markup.button('Акції'),
    ], [
        Markup.button('Наші точки приймання'),
        Markup.button('Статус замовлення'),
    ], [
        Markup.button('Викликати кур`єра'),
        Markup.button('Мої адреси'),
    ]]).extra();
};

module.exports = {
    CLIENT_NAME_SCENE,
    ADDRESS_SCENE_NAME,
    TIME_SCENE_NAME,
    PHONENUMBER_SCENE_NAME,
    FINISH_SCENE_NAME,
    MY_ADDRESSES_SCENE_NAME,

    markupMenu,
};
