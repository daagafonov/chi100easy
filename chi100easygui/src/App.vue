<template>
    <div id="app">

        <b-navbar variant="faded" type="light">
            <b-navbar-toggle target="navbar-toggle-collapse">
                <template v-slot:default="{ expanded }">
                    <b-icon v-if="expanded" icon="chevron-bar-up"></b-icon>
                    <b-icon v-else icon="chevron-bar-down"></b-icon>
                </template>
            </b-navbar-toggle>
            <b-navbar-brand to="/">Chystoprosto Admin</b-navbar-brand>

            <b-collapse id="navbar-toggle-collapse" is-nav>
                <b-navbar-nav>

                    <b-nav-item-dropdown left v-if="isAuthenticated()">
                        <template v-slot:button-content>
                            <em>Menu</em>
                        </template>
                        <b-dropdown-item to="/users.html">Пользователи</b-dropdown-item>
                        <b-dropdown-item to="/products.html">Продукты</b-dropdown-item>
                        <b-dropdown-item to="/payments.html">Платежи</b-dropdown-item>
                    </b-nav-item-dropdown>

                    <b-nav-item-dropdown right v-if="isAuthenticated()">
                        <template v-slot:button-content>
                            <em>Account</em>
                        </template>
                        <b-dropdown-item to="/logout.html">Logout</b-dropdown-item>
                    </b-nav-item-dropdown>

                    <b-nav-item to="/login.html" v-if="!isAuthenticated()">Login</b-nav-item>

                </b-navbar-nav>
            </b-collapse>

        </b-navbar>

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
