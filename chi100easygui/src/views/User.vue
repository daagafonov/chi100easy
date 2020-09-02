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
                <b-button size="sm" v-b-modal.my-modal @click="details(row.item, row.index, $event.target)"
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
                {key: 'firstName'},
                {key: 'lastName'},
                {key: 'username'},
                {key: 'telegramUserId'},
                {key: 'actions', label: 'Actions'}
            ],
            filter: null,
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

}
</script>
