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
    state: {},
    mutations: {
        getUsers(state, payload: any) {
            EventService.sendEvent('getUsers', payload);
        },
        addUser(state, payload) {
            EventService.sendEvent('addUser', payload);
        },
        editUser(state, payload) {
            EventService.sendEvent('editUser', payload);
        },
        getProducts(state, payload) {
            console.log('mutation', payload);
            EventService.sendEvent('getProducts', payload);
        },
        editProduct(state, payload) {
            EventService.sendEvent('editProduct', payload);
        },
        addProduct(state, payload) {
            EventService.sendEvent('addProduct', payload);
        },

        getOrders(state, payload) {
            EventService.sendEvent('getOrders', payload);
        }
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

                console.log(response);
            }).catch(error => {
                console.log(error);
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

                console.log(response);
            }).catch(error => {
                console.log(error);
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
                    console.log('action', payload);
                    commit('getProducts', {
                        action: 'products',
                        payload,
                    });
                }
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
                console.log(error);
            });
        },

        addProduct({commit}, payload: any) {
            axios.post(`${sessionStorage.getItem('backendUrl')}/products/`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {

                console.log('response', response);

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
                console.log(error);
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
                    console.log('action', payload);
                    commit('getOrders', {
                        action: 'orders',
                        payload,
                    });
                }
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
                console.log(error);
            });
        },

        addOrder({commit}, payload: any) {
            const userId = payload.userId;
            axios.post(`${sessionStorage.getItem('backendUrl')}/orders/user/${userId}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then((response: any) => {

                console.log('response', response);

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
                console.log(error);
            });
        },
    },
    modules: {}
});


