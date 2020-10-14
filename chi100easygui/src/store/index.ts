import Vue from 'vue';
import Vuex, {mapActions} from 'vuex';
import axios from 'axios';
import EventService from "@/services/event.service";

Vue.use(Vuex);

function wrapError(error: any) {
    EventService.sendEvent('error', {
        message: error,
    });
}

function createAuthorizationHeader() {
    return `Bearer ${localStorage.getItem('user-token')}`;
}

const generalErrorHandler = (commit: any, error: any, callback?: () => void) => {
    const { ok, message } = error.response.data;

    if (!ok) {

        const { code, description } = message;
        if (code === 'INVALID_TOKEN') {

            axios.post(`${sessionStorage.getItem('backendUrl')}/auth/token`, {
                token: localStorage.getItem('refresh-token'),
            })
                .then((response: any) => {
                    localStorage.setItem('user-token', response.data.accessToken);

                    if (callback) {
                        callback();
                    }

                }).catch(error => {
                    console.log(error);
            });

        } else {
            commit('generalError', error);
        }
    }
};

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('user-token') || '',
        refreshToken: localStorage.getItem('refresh-token') || '',
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
        loginSuccess(state, payload) {
            localStorage.setItem('user-token', payload.token);
            localStorage.setItem('refresh-token', payload.refreshToken);
            state.status = 'Logged in';

            EventService.sendEvent('loggedin', {});
        },
        loginFailed(state, payload) {
            EventService.sendEvent('loggedFailed', payload.response.data);
        },
        logoutSuccess(state, payload) {
            localStorage.removeItem('user-token');
            localStorage.removeItem('refresh-token');
            state.status = '';
            EventService.sendEvent('loggedout', {});
        },
        logoutFailed(state, payload) {
            console.log('logout failed', payload.response.data);
        },
        generalError(state, payload) {
            console.log('error', payload.response.data);
        },

        removeProduct(state, payload) {
            EventService.sendEvent('reload', {});
        }
    },
    actions: {

        getUsers({dispatch, commit}, payload: any) {
            axios.get(`${sessionStorage.getItem('backendUrl')}/users/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err, () => {
                    dispatch('getUsers', payload);
                });
            });
        },

        addUser({dispatch, commit}, payload: any) {
            console.log('payload', payload);
            axios.post(`${sessionStorage.getItem('backendUrl')}/users/`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err, () => {
                    dispatch('addUser', payload);
                });
            });
        },

        editUser({dispatch, commit}, payload: any) {
            axios.put(`${sessionStorage.getItem('backendUrl')}/users/${payload.id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err, () => {
                    dispatch('editUser', payload);
                });
            });
        },

        getProducts({dispatch, commit}) {
            axios.get(`${sessionStorage.getItem('backendUrl')}/products/`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err, () => {
                    dispatch('getProducts');
                });
            });
        },
        editProduct({commit}, payload: any) {
            axios.put(`${sessionStorage.getItem('backendUrl')}/products/${payload.id}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err);
            });
        },

        addProduct({commit}, payload: any) {
            axios.post(`${sessionStorage.getItem('backendUrl')}/products/`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err);
            });
        },
        getOrders({commit}, payload: any) {

            const userId = payload.userId;

            axios.get(`${sessionStorage.getItem('backendUrl')}/orders/user/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err);
            });
        },
        editOrder({commit}, payload: any) {
            const userId = payload.userId;
            axios.put(`${sessionStorage.getItem('backendUrl')}/orders/user/${userId}`, payload, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err);
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
                    'Content-Type': 'multipart/form-data',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err);
            });
        },

        saveOrder({commit}, order: any) {
            const userId = order.user;

            if (order._id) {
                // update
                axios.put(`${sessionStorage.getItem('backendUrl')}/orders/${order._id}`, order, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': createAuthorizationHeader(),
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
                }).catch(err => {
                    generalErrorHandler(commit, err);
                });
            } else {
                // create
                axios.post(`${sessionStorage.getItem('backendUrl')}/orders/user/${userId}`, order, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': createAuthorizationHeader(),
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
                }).catch(err => {
                    generalErrorHandler(commit, err);
                });
            }
        },
        sendDocument({commit}, payload: any) {
            const { orderId } = payload;

            axios.post(`${sessionStorage.getItem('backendUrl')}/orders/${orderId}/send`, {}, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err);
            });
        },
        getPayments({commit}, payload: any) {

            axios.get(`${sessionStorage.getItem('backendUrl')}/payments`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
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
            }).catch(err => {
                generalErrorHandler(commit, err);
            });
        },

        login({commit}, payload: any) {
            axios.post(`${sessionStorage.getItem('backendUrl')}/auth/login`, payload)
                .then((response: any) => {
                    if (response.data.ok) {
                        commit('loginSuccess', {
                            token: response.data.accessToken,
                            refreshToken: response.data.refreshToken,
                        });
                    }
                }).catch(error => {
                    commit('loginFailed', error);
                });
        },

        logout({commit}, payload: any) {

            axios.post(`${sessionStorage.getItem('backendUrl')}/auth/logout`, {
                token: localStorage.getItem('refresh-token')
            })
                .then((response: any) => {
                    if (response.data.ok) {
                        commit('logoutSuccess', {});
                    }
                }).catch(error => {
                    commit('logoutFailed', error);
                });
        },

        removeProduct({commit}, payload: any) {
            axios.delete(`${sessionStorage.getItem('backendUrl')}/products/${payload.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': createAuthorizationHeader(),
                }
            }).then((response: any) => {
                if (response.message) {
                    wrapError(response.message);
                } else {
                    const payload = response.data;
                    commit('removeProduct', {
                        payload,
                    });
                }
            }).catch(err => {
                generalErrorHandler(commit, err);
            });
        }
    },
    modules: {}
});


