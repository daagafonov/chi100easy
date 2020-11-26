const {Markup} = require('telegraf');

const CLIENT_NAME_SCENE = 'clientname';
const ADDRESS_SCENE_NAME = 'address';
const TIME_SCENE_NAME = 'time';
const PHONENUMBER_SCENE_NAME = 'phonenumber';
const FINISH_SCENE_NAME = 'finish';
const MY_ADDRESSES_SCENE_NAME = 'myaddresses';
const FEEDBACK_SCENE_NAME = 'feedback';
const ADD_ADDRESS_SCENE_NAME = 'addAddress';

const mainMenu = () => {
    return Markup.resize(true).keyboard([[
        Markup.button('Чисто Просто'),
        Markup.button('Мій профіль'),
    ], [
        Markup.button('Мої дії')
    ]]).extra();
};

const myProfileMenu = () => {
    return Markup.resize(true).keyboard([[
        Markup.button('Мої адреси'),
        Markup.button('Бонусний рахунок'),
    ],[
        Markup.button('Мій ЧистоПросто ID'),
        Markup.button('Головне меню'),
    ]]).extra();
};

const chi100EasyMenu = () => {
    return Markup.resize(true).keyboard([[
        Markup.button('Наші точки приймання'),
        Markup.button('Акції'),
    ],[
        Markup.button('Прайси'),
        Markup.button('Головне меню'),
    ]]).extra();
};

const myActions = () => {
    return Markup.resize(true).keyboard([[
        Markup.button('Викликати кур`єра'),
        Markup.contactRequestButton('Зв`язатися зі мною'),
    ],[
        Markup.button('Головне меню'),
    ]]).extra();
};

module.exports = {
    CLIENT_NAME_SCENE,
    ADDRESS_SCENE_NAME,
    TIME_SCENE_NAME,
    PHONENUMBER_SCENE_NAME,
    FINISH_SCENE_NAME,
    MY_ADDRESSES_SCENE_NAME,
    FEEDBACK_SCENE_NAME,
    ADD_ADDRESS_SCENE_NAME,

    // markupMenu,
    mainMenu,
    myProfileMenu,
    chi100EasyMenu,
    myActions,
};
