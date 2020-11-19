const axios = require('axios');
const FormData = require('form-data');

const confirmPaymentIsDone = (chatId, message, replyMarkup) => {

    const data = {
        chat_id: chatId,
        text: message,
    };

    if (replyMarkup) {
        data.parse_mode = 'Markdown';
        data.reply_markup = replyMarkup;
    }

    return axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, data);
};

const sendServiceMessageCallMe = (message) => {
    return new Promise( resolve => {
        process.env.CALLME_SERVICE_IDS.split(',').forEach(async val => {
            const data = {
                chat_id: val,
                text: message,
            };
            await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`, data);
        });
        resolve();
    });
}

const sendDocument = (order, content) => {
    const form = new FormData();
    // console.log('creating data');
    form.append('document', content, {
        filename: order.document.name,
        contentType: order.document.type,
        knownLength: order.document.size,
    });
    // console.log('creating chat_id');
    form.append('chat_id', order.user.telegramUserId);
    // if (caption) {
    // console.log('creating caption');
    // form.append('caption', 'Please confirm an order');

    return axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendDocument`, form, {
        headers: form.getHeaders()
    });
};


module.exports = {
    confirmPaymentIsDone,
    sendDocument,
    sendServiceMessageCallMe,
}
