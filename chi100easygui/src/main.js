import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

Vue.config.productionTip = false;

axios.get('/chi100easy/static/app.config.json', {
  'Content-Type': 'application/json'
}).then((response) => {
  const data = response.data;
  sessionStorage.setItem('backendUrl', data.backendUrl);
});

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
