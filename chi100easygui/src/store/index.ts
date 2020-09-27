import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import EventService from "@/services/event.service";

Vue.use(Vuex);

function wrapError(error: any) {
    EventService.sendEvent('error', {
        message: error,
    });
}

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('user-token') || '',
        status: '',
    },
    getters: {
        isAuthenticated: state => !!state.token,
        authStatus: state => state.status,
    },
    mutations: {

        // users
        getUsers(state, payload: any) {
            EventService.sendEvent('getUsers', payload);
        },
        addUser(state, payload) {
            EventService.sendEvent('addUser', payload);
        },
        editUser(state, payload) {
            EventService.sendEvent('editUser', payload);
        },

        // products
        getProducts(state, payload) {
            EventService.sendEvent('getProducts', payload);
        },
        editProduct(state, payload) {
            EventService.sendEvent('editProduct', payload);
        },
        addProduct(state, payload) {
            EventService.sendEvent('addProduct', payload);
        },

        // orders
        getOrders(state, payload) {
            EventService.sendEvent('getOrders', payload);
        },
        addOrder(state, payload) {
            EventService.sendEvent('addOrder', payload);
        },
        editOrder(state, payload) {
            EventService.sendEvent('editOrder', payload);
        },
        sendDocument(state, payload) {
            EventService.sendEvent('sendDocument', payload);
        },

        // payments
        getPayments(state, payload) {
            EventService.sendEvent('getPayments', payload);
        },
    },
    actions: {

        getUsers({commit}, payload: any) {
            axios.get(`${sessionStorage.getItem('backendUrl')}/users/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const payload = response.data;
                    commit('getUsers', {
                        action: 'users',
                        payload,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },

        addUser({commit}, payload: any) {
            console.log('payload', payload);
            axios.post(`${sessionStorage.getItem('backendUrl')}/users/`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const {data} = response.data;
                    commit('addUser', {
                        action: 'addUser',
                        payload: data,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },

        editUser({commit}, payload: any) {
            console.log('payload', payload);
            axios.put(`${sessionStorage.getItem('backendUrl')}/users/${payload.id}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const {data} = response.data;
                    commit('editUser', {
                        action: 'editUser',
                        payload: data,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },

        getProducts({commit}) {

            console.log('get products');

            axios.get(`${sessionStorage.getItem('backendUrl')}/products/`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const payload = response.data;
                    commit('getProducts', {
                        action: 'products',
                        payload,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },
        editProduct({commit}, payload: any) {
            axios.put(`${sessionStorage.getItem('backendUrl')}/products/${payload.id}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const {data} = response.data;
                    commit('editProduct', {
                        action: 'editProduct',
                        payload: data,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },

        addProduct({commit}, payload: any) {
            axios.post(`${sessionStorage.getItem('backendUrl')}/products/`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const {data} = response.data;
                    commit('addProduct', {
                        action: 'addProduct',
                        payload: data,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },
        getOrders({commit}, payload: any) {

            const userId = payload.userId;

            axios.get(`${sessionStorage.getItem('backendUrl')}/orders/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const payload = response.data;
                    commit('getOrders', {
                        action: 'orders',
                        payload,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },
        editOrder({commit}, payload: any) {
            const userId = payload.userId;
            axios.put(`${sessionStorage.getItem('backendUrl')}/orders/user/${userId}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const {data} = response.data;
                    commit('editOrder', {
                        action: 'editOrder',
                        payload: data,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },

        addOrder({commit}, payload: any) {

            console.log('addOrder', payload);

            const userId = payload.userId;

            let formData = new FormData();
            formData.append('file', payload.file, payload.file.name);
            formData.append('userId', payload.userId);
            formData.append('comment', payload.comment);
            formData.append('finalCost', payload.finalCost);
            formData.append('externalOrderId', payload.externalOrderId);


            axios.post(`${sessionStorage.getItem('backendUrl')}/orders/user/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const {data} = response.data;
                    commit('addOrder', {
                        action: 'addOrder',
                        payload: data,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },

        saveOrder({commit}, order: any) {
            const userId = order.user;

            if (order._id) {
                // update
                axios.put(`${sessionStorage.getItem('backendUrl')}/orders/${order._id}`, order, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response: any) => {
                    if (response.message) {
                        wrapError(response.message);
                    } else {
                        const {data} = response.data;
                        commit('editOrder', {
                            action: 'editOrder',
                            payload: data,
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            } else {
                // create
                axios.post(`${sessionStorage.getItem('backendUrl')}/orders/user/${userId}`, order, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then((response: any) => {
                    if (response.message) {
                        wrapError(response.message);
                    } else {
                        const {data} = response.data;
                        commit('addOrder', {
                            action: 'addOrder',
                            payload: data,
                        });
                    }
                }).catch(error => {
                    console.error(error);
                });
            }
        },
        sendDocument({commit}, payload: any) {
            const { orderId } = payload;

            axios.post(`${sessionStorage.getItem('backendUrl')}/orders/${orderId}/send`, {}, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const {data} = response.data;
                    commit('sendDocument', {
                        action: 'sendDocument',
                        payload: data,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },
        getPayments({commit}, payload: any) {

            axios.get(`${sessionStorage.getItem('backendUrl')}/payments`, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const payload = response.data;
                    commit('getPayments', {
                        action: 'payments',
                        payload,
                    });
                }
            }).catch(error => {
                console.error(error);
            });
        },
    },
    modules: {}
});


