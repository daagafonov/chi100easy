<template>
    <div>
        <b-modal id="my-modal" hide-footer>
            <template v-slot:modal-title>
                Диалог создания пользователя
            </template>
            <div class="d-block text-center">
                <b-row>
                    <b-col md="4">Имя</b-col>
                    <b-col md="8"><b-input type="text" placeholder="Enter first name" name="firstName" v-model="form.firstName" /></b-col>
                </b-row>
                <b-row>
                    <b-col md="4">Фамилия</b-col>
                    <b-col md="8"><b-input type="text" placeholder="Enter last name" name="lastName" v-model="form.lastName"/></b-col>
                </b-row>
                <b-row>
                    <b-col md="4">Ник</b-col>
                    <b-col md="8"><b-input type="text" placeholder="Enter user name" name="username" v-model="form.username"/></b-col>
                </b-row>
                <b-row>
                    <b-col md="4">Telegram ID</b-col>
                    <b-col md="8"><b-input type="text" name="telegramUserId" :disabled="tuidDisbaled()" disabled v-model="form.telegramUserId"/></b-col>
                </b-row>
            </div>
            <br/>
            <b-button-group style="text-align: right; width: 100%;">
                <b-button variant="success" @click="onSave()">
                    Save
                </b-button>
                <b-button variant="danger">
                    Cancel
                </b-button>
            </b-button-group>
        </b-modal>
    </div>
</template>

<script lang="ts">

import EventService from "@/services/event.service";
import {Component, Vue} from "vue-property-decorator";

@Component({})
export default class AddUserModal extends Vue {
    data() {
        return {
            action: 'add',
            form: {
                firstName: '',
                lastName: '',
                username: '',
                telegramUserId: '',
            }
        };
    }

    mounted() {
        EventService.subscribeEvent('add-user', (payload: any) => {
            this.$data.action = 'add';
            this.$data.form = {
                firstName: payload.firstName,
                lastName: payload.lastName,
                username: payload.username,
                telegramUserId: payload.telegramUserId,
            };
        });
        EventService.subscribeEvent('edit-user', (payload: any) => {
            this.$data.action = 'edit';
            this.$data.form = {
                id: payload._id,
                firstName: payload.firstName,
                lastName: payload.lastName,
                username: payload.username,
                telegramUserId: payload.telegramUserId,
            };
        });

        EventService.subscribeEvent('addUser', (payload: any) => {
            this.$nextTick(() => {
                this.$bvModal.hide('my-modal');

                EventService.sendEvent('reload', {});
            })
        });

        EventService.subscribeEvent('editUser', (payload: any) => {
            this.$nextTick(() => {
                this.$bvModal.hide('my-modal');

                EventService.sendEvent('reload', {});
            })
        });
    }

    tuidDisbaled() {
        return false;
    }

    onSave() {
        this.$store.dispatch(this.$data.action === 'add' ? 'addUser' : 'editUser', this.$data.form);
    }
}
</script>

<style>

</style>
