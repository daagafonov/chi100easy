<template>
    <div class="container">
        <div class="error">
            {{errorMessage}}
        </div>
        <b-form>
            <b-form-group>
                <b-row>
                    <b-col md="6" class="bold">
                        <label for="email">Email</label>
                    </b-col>
                    <b-col md="6">
                        <b-input type="text" id="email" name="email" v-model="email" />
                    </b-col>
                </b-row>
            </b-form-group>
            <b-form-group>
                <b-row>
                    <b-col md="6" class="bold">
                        <label for="password">Пароль</label>
                    </b-col>
                    <b-col md="6">
                        <b-input type="password" id="password" name="password" v-model="password" />
                    </b-col>
                </b-row>
            </b-form-group>
            <b-row>
                <b-col md="12">
                    <b-button @click="login()">Войти</b-button>
                </b-col>
            </b-row>
        </b-form>
    </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import EventService from "@/services/event.service";
import router from "@/router";

@Component({

})
export default class LoginComponent extends Vue {

    data() {
        return {
            email: '',
            password: '',
            errorMessage: '',
        };
    }

    login() {
        this.$store.dispatch('login', {
            email: this.$data.email,
            password: this.$data.password,
        });
    }

    beforeMount() {
        EventService.subscribeEvent('loggedin', (payload: any) => {
            router.push({
                name: 'Users'
            });
        });
        EventService.subscribeEvent('loggedFailed', (payload: any) => {
            this.$data.errorMessage = payload.message;
        });
    }
}
</script>

<style lang="scss">
.bold {
    font-weight: bold;
}
</style>
