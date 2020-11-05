const axios = require('axios');

const {authStorage} = require('./shared');

const createAuthorizationHeader = () => {
    return `Bearer ${authStorage.auth}`;
}

const get = (uri) => {
    return axios.get(uri, {
        headers: {
            'Authorization': createAuthorizationHeader(),
        }
    });
};

const del = (uri) => {
    return axios.delete(uri, {
        headers: {
            'Authorization': createAuthorizationHeader(),
        }
    });
};

const getWithConfig = (uri, config) => {

    config.headers.Authorization = createAuthorizationHeader();

    return axios.get(uri, config);
};

const put = (uri, data) => {
    return axios.put(uri, data, {
        headers: {
            'Authorization': createAuthorizationHeader(),
        }
    });
};

const post = (uri, data) => {
    return axios.post(uri, data, {
        headers: {
            'Authorization': createAuthorizationHeader(),
        }
    });
};

const getUserByTelegramID = (ctx) => {
    return get(`${process.env.API_URI}/users/byTelegramUserId/${ctx.message.from.id}`);
};

const updateUserPhone = (ctx, user) => {
    return put(`${process.env.API_URI}/users/${user.data._id}/phoneNumber`, {
        phoneNumber: ctx.message.contact.phone_number,
    });
}

const getUserAddresses = (userId) => {
    return get(`${process.env.API_URI}/addresses/user/${userId}`);
};

const sendCourier = (data) => {
    return post(`${process.env.API_URI}/service/sendCourier`, data);
};

const createUser = (data) => {
    return post(`${process.env.API_URI}/users`, data);
};

const findFirstAvailable = () => {
    return get(`${process.env.API_URI}/offers/firstAvailable`);
};

const getAllAvailable = () => {
    return get(`${process.env.API_URI}/offers/allAvailable`);
};

const removeAddress = (addressId) => {
    return del(`${process.env.API_URI}/addresses/${addressId}`);
};

module.exports = {
    getUserByTelegramID,
    updateUserPhone,
    getUserAddresses,
    sendCourier,
    createUser,
    findFirstAvailable,
    getAllAvailable,
    removeAddress,
}
