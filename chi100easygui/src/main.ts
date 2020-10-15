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

const aaa = require('./VueQrcodeReader.umd.min');
Vue.use(aaa);

// const comp = Vue.extend({
//     template: '<div>\n' +
//         '    <ul\n' +
//         '      :id="elementId"\n' +
//         '      class="vue-simple-context-menu"\n' +
//         '      v-click-outside="onClickOutside"\n' +
//         '    >\n' +
//         '      <li\n' +
//         '        v-for="(option, index) in options"\n' +
//         '        :key="index"\n' +
//         '        @click.stop="optionClicked(option)"\n' +
//         '        class="vue-simple-context-menu__item"\n' +
//         '        :class="[option.class, (option.type === \'divider\' ? \'vue-simple-context-menu__divider\' : \'\')]"\n' +
//         '      >\n' +
//         '        {{option.name}}\n' +
//         '      </li>\n' +
//         '    </ul>\n' +
//         '  </div>',
//     name: 'VueSimpleContextMenu',
//     props: {
//         elementId: {
//             type: String,
//             required: true
//         },
//         options: {
//             type: Array,
//             required: true
//         }
//     },
//     data () {
//         return {
//             item: null,
//             menuWidth: null,
//             menuHeight: null
//         }
//     },
//     methods: {
//         showMenu (event: any, item: any) {
//             this.item = item
//
//             var menu = document.getElementById(this.elementId)
//             if (!menu) {
//                 return
//             }
//
//             if (!this.menuWidth || !this.menuHeight) {
//                 menu.style.visibility = "hidden"
//                 menu.style.display = "block"
//                 this.$data.menuWidth = menu.offsetWidth
//                 this.$data.menuHeight = menu.offsetHeight
//                 menu.removeAttribute("style")
//             }
//
//             if ((this.menuWidth + event.pageX) >= window.innerWidth) {
//                 menu.style.left = (event.pageX - this.$data.menuWidth + 2) + "px"
//             } else {
//                 menu.style.left = (event.pageX - 2) + "px"
//             }
//
//             if ((this.menuHeight + event.pageY) >= window.innerHeight) {
//                 menu.style.top = (event.pageY - this.$data.menuHeight + 2) + "px"
//             } else {
//                 menu.style.top = (event.pageY - 2) + "px"
//             }
//
//             menu.classList.add('vue-simple-context-menu--active')
//         },
//         hideContextMenu () {
//             let element = document.getElementById(this.elementId)
//             if (element) {
//                 element.classList.remove('vue-simple-context-menu--active');
//             }
//         },
//         onClickOutside () {
//             this.hideContextMenu()
//         },
//         optionClicked (option: any) {
//             this.hideContextMenu()
//             this.$emit('option-clicked', {
//                 item: this.$data.item,
//                 option: option
//             })
//         },
//         onEscKeyRelease (event: any) {
//             if (event.keyCode === 27) {
//                 this.hideContextMenu();
//             }
//         }
//     },
//     mounted () {
//         document.body.addEventListener('keyup', this.onEscKeyRelease);
//     },
//     beforeDestroy () {
//         document.removeEventListener('keyup', this.onEscKeyRelease);
//     },
//     render: h => h(),
// });
// Vue.component('vue-simple-context-menu', comp);

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
