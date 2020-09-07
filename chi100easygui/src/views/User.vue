<template>
    <div class="users">
        <div>Users, {{ greeting }}</div>
        <b-form>
            <b-form-group>
                <b-row>
                    <b-col md="5">
                        <b-form-input v-model="filter"></b-form-input>
                    </b-col>
                </b-row>
            </b-form-group>
        </b-form>
        <b-table id="usersTable" hover striped caption-top responsive
                 :items="userList1"
                 :fields="fields"
                 :filter="filter"
        >
            <template v-slot:table-caption>Список зарегистрированных пользователей</template>

            <template v-slot:cell(actions)="row">

                <label>File
                    <input type="file" id="file" v-on:change="sendDocument(row.item, $event.target.files)"
                           accept="application/pdf"/>
                </label>
                <!--                <b-button variant="success" v-on:click="submitFile()">Submit</b-button>-->

                <b-button size="sm" variant="warning" @click="orders(row.item, row.index, $event.target)">
                    Orders
                </b-button>
                <b-button size="sm" variant="warning" v-b-modal.my-modal
                          @click="details(row.item, row.index, $event.target)"
                          class="mr-1">
                    Details
                </b-button>
                <b-button size="sm" @click="delete(row.item, row.index, $event.target)">
                    Delete
                </b-button>
            </template>
        </b-table>

        <add-user-modal></add-user-modal>

    </div>
</template>

<script lang="ts">

import AddUser from '@/components/AddUser.vue'
import {Component, Vue} from 'vue-property-decorator'
import EventService from '@/services/event.service'

import axios from 'axios';

@Component({
    components: {
        'add-user-modal': AddUser,
    }
})
export default class UserComponent extends Vue {

    data() {
        return {
            userList1: [],
            greeting: '...',
            fields: [
                {key: 'firstName', label: 'Имя'},
                {key: 'lastName', label: 'Фамилия'},
                {key: 'username', label: 'Имя пользователя'},
                {key: 'telegramUserId', label: 'Телеграм ID'},
                {key: 'actions', label: 'Действия'}
            ],
            filter: null,
            file: '',
            telegramUserId: '',
            chatId: '',
        };
    }

    created() {
        this.$store.dispatch('getUsers', {});
    }

    beforeMount() {

        EventService.subscribeEvent('getUsers', (payload: any) => {
            this.$data.userList1 = [];
            for (var i in payload.payload) {
                this.$data.userList1.push(payload.payload[i]);
            }
        });
        EventService.subscribeEvent('reload', (payload: any) => {
            this.$store.dispatch('getUsers', {});
        });
    }

    addUser(event: any) {
        EventService.sendEvent('add-user', {});
    }

    deleteUser(userId: string) {
        // delete by id
    }

    details(item: any, index: any, event: any) {
        EventService.sendEvent('edit-user', item);
    }

    delete(item: any, index: any, event: any) {

    }

    orders(item: any, index: any, event: any) {
        this.$router.push({
            name: 'Orders',
            query: {
                userId: item._id,
            }
        });
    }

    sendDocument(item: any, files: any) {
        this.$data.file = files[0];
        this.$data.telegramUserId = item.telegramUserId;
        this.$data.chatId = item.chatId;

        this.submitFile();
    }

    submitFile() {

        let formData = new FormData();
        formData.append('file', this.$data.file, this.$data.file.name);
        formData.append('telegramUserId', this.$data.telegramUserId);
        formData.append('chatId', this.$data.chatId);
        formData.append('caption', 'Подтверждение заказа!');

        axios.post('/bot/shareDocument',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        ).then(function () {
            console.log('SUCCESS!!');
        })
            .catch(function () {
                console.log('FAILURE!!');
            });
    }

}
</script>
