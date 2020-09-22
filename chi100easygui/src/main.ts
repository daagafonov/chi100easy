import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import axios from 'axios';

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { BootstrapVue, BootstrapVueIcons } from 'bootstrap-vue';

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);

Vue.config.productionTip = false;

axios.get('/chi100easy/static/app.config.json', {
  headers: {
    'Content-Type': 'application/json'
  }
}).then((response) => {
  const data = response.data;
  sessionStorage.setItem('backendUrl', data.backendUrl);

  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app');

});