<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Домашняя</router-link> |
      <router-link to="/about.html">О Нас</router-link> |
      <router-link v-if="isAuthenticated()" to="/users.html">Пользователи</router-link> |
      <router-link v-if="isAuthenticated()" to="/products.html">Продукты</router-link> |
      <router-link v-if="isAuthenticated()" to="/payments.html">Платежи</router-link> |
      <router-link v-if="!isAuthenticated()" to="/login.html">Login</router-link>
    </div>
    <b-container ma>
      <router-view/>
    </b-container>
  </div>
</template>
<script lang="ts">

import {Component, Vue} from 'vue-property-decorator';
import router from "@/router";

@Component({})
export default class AppComponent extends Vue {

    isAuthenticated(): boolean {
        return localStorage.getItem('user-token') ? true : false;
    }
}
</script>
<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
