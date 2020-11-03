const axios = require('axios');

const getUserByTelegramID = (ctx) => {
    return axios.get(`${process.env.API_URI}/users/byTelegramUserId/${ctx.message.from.id}`);
};

const updateUserPhone = (ctx, user) => {
    return axios.put(`${process.env.API_URI}/users/${user.data._id}/phoneNumber`, {
        phoneNumber: ctx.message.contact.phone_number,
    });
}

const getUserAddresses = (userId) => {
    return axios.get(`${process.env.API_URI}/addresses/user/${userId}`);
};

const sendCourier = (data) => {
    return axios.post(`${process.env.API_URI}/service/sendCourier`, data);
};

module.exports = {
    getUserByTelegramID,
    updateUserPhone,
    getUserAddresses,
    sendCourier,
}
