const axios = require('axios');

const confirmDocument = (message_id, chat, document, order) => {
    return axios.post(`${process.env.BOT_SERVER_URI}/confirmDocument`, {
        message_id: message_id,
        chat_id: chat.id,
        file_id: document.file_id,
        file_unique_id: document.file_unique_id,
        order_id: order._id,
        externalOrderId: order.externalOrderId,
    });
};

module.exports = {
    confirmDocument,
}