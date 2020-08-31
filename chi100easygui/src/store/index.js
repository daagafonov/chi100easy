import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: [],
  },
  getters: {
    getUserList: (state) => {
      return state.users;
    }
  },
  mutations: {
    success(state, payload) {

      const {action} = payload;
      const data = payload.payload;

      switch(action) {
        case 'users':
          state.users = [];

          for(var i in data) {
            state.users.push(data[i]);
          }

          break;
      }

    }
  },
  actions: {
    getUsers({ commit }) {
      axios.get(`${sessionStorage.getItem('backendUrl')}/users/`, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin' : '*',
      }).then((response) => {
        const payload = response.data;
        commit('success', {
          action: 'users',
          payload,
        });
      });
    }
  },
  modules: {
  }
})
