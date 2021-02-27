<template>
    <div class="users">

        <p class="error">{{ error }}</p>
        <p class="decode-result">Last result: <b>{{ result }}</b></p>
        <div class="wrapper">
            <qrcode-stream @decode="onDecode" @init="onInit" v-if="showScanner"></qrcode-stream>
        </div>
        <div>
            <b-button class="btn" @click="scan()">Сканировать...</b-button>
        </div>

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
            <template v-slot:table-caption>
                <span>Список зарегистрированных пользователей</span>
                <b-button @click="updateList()" class="btn btn-success">Обновить список</b-button>
            </template>

            <template v-slot:cell(actions)="row">
                <b-button size="sm" variant="warning" @click="orders(row.item, row.index, $event.target)">
                    Заказы
                </b-button>
                <b-button size="sm" variant="warning" v-b-modal.my-modal
                          @click="details(row.item, row.index, $event.target)"
                          class="mr-1">
                    Детали
                </b-button>
            </template>
        </b-table>

        <add-user-modal></add-user-modal>

    </div>
</template>

<script lang="ts">

import AddUser from '@/components/AddUser.vue';
import { Component, Vue } from 'vue-property-decorator';
import EventService from '@/services/event.service';

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
                {key: 'bonus', label: 'Бонус'},
                {key: 'actions', label: 'Действия'},
            ],
            filter: null,
            file: '',
            telegramUserId: '',
            chatId: '',
            error: '',
            result: '',
            showScanner: false,
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

    onDecode (result: any) {
        this.$data.filter = result;
        this.$data.showScanner = false;
    }

    async onInit (promise: any) {
        try {
            await promise;
        } catch (error) {
            if (error.name === 'NotAllowedError') {
                this.$data.error = "ERROR: you need to grant camera access permisson"
            } else if (error.name === 'NotFoundError') {
                this.$data.error = "ERROR: no camera on this device"
            } else if (error.name === 'NotSupportedError') {
                this.$data.error = "ERROR: secure context required (HTTPS, localhost)"
            } else if (error.name === 'NotReadableError') {
                this.$data.error = "ERROR: is the camera already in use?"
            } else if (error.name === 'OverconstrainedError') {
                this.$data.error = "ERROR: installed cameras are not suitable"
            } else if (error.name === 'StreamApiNotSupportedError') {
                this.$data.error = "ERROR: Stream API is not supported in this browser"
            }
        }
    }

    scan() {
        this.$data.showScanner = !this.$data.showScanner;
    }

    updateList() {
        this.$store.dispatch('getUsers', {});
    }

}
</script>

<style scoped>
.wrapper {
    position: relative;
    z-index: 1000;
    width: 500px;
    left: 200px;
}
.error {
    font-weight: bold;
    color: red;
}
</style>
