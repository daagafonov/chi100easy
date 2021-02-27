<template>
    <div>
        <b-modal id="order-modal" hide-footer>
            <template v-slot:modal-title>
                Диалог создания и редактирования заказа
            </template>
            <div class="d-block text-center">
                <input
                    type="hidden"
                    id="userId"
                    name="userId"
                    :value="form.userId"
                ></input>
                <b-row>
                    <b-col :md="headerTitle" class="nowrap">Документ :</b-col>
                    <b-col :md="headerValue"><b-file type="file"
                                          placeholder="Документ"
                                          name="document"
                                          accept="application/pdf"
                                          @change="storeDocument($event.target.files)"
                    /></b-col>
                </b-row>
                <b-row>
                    <b-col :md="headerTitle" class="nowrap">Номер заказа: </b-col>
                    <b-col :md="headerValue"><b-textarea
                        placeholder="Номер заказа"
                        name="externalOrderId"
                        v-model="form.externalOrderId"
                    /></b-col>
                </b-row>
                <b-row>
                    <b-col :md="headerTitle" class="nowrap">Коментарий: </b-col>
                    <b-col :md="headerValue"><b-textarea
                                          placeholder="Коментарий"
                                          name="comment"
                                          v-model="form.comment"
                                          rows="5"
                    /></b-col>
                </b-row>
                <b-row>
                    <b-col :md="headerTitle" class="nowrap">Финальная сумма: </b-col>
                    <b-col :md="headerValue"><b-input
                        placeholder="Финальная сумма"
                        name="finalCost"
                        v-model="form.finalCost"
                    /></b-col>
                </b-row>
            </div>
            <br/>
            <b-button-group style="text-align: right; width: 100%;">
                <b-button variant="success" @click="onSave()">
                    Сохранить
                </b-button>
                <b-button variant="danger" @click="close()">
                    Отменить
                </b-button>
            </b-button-group>
        </b-modal>
    </div>
</template>

<script lang="ts">

import EventService from "@/services/event.service";
import {Component, Vue} from "vue-property-decorator";

@Component({
    name: 'order-modal'
})
export default class OrderModal extends Vue {

    headerTitle: number = 4;
    headerValue: number = 8;

    data() {
        return {
            action: 'add',
            form: {
                userId: '',
                document: '',
                externalOrderId: '',
                comment: '',
                status: '',
                finalCost: '',

                file: '',
            }
        };
    }

    mounted() {

        EventService.subscribeEvent('order-modal', (payload: any) => {
            this.$data.action = 'add';
            this.$data.form = {
                userId: payload.userId,
            };
        });

        // EventService.subscribeEvent('add-user', (payload: any) => {
        //     this.$data.action = 'add';
        //     this.$data.form = {
        //         firstName: payload.firstName,
        //         lastName: payload.lastName,
        //         username: payload.username,
        //         telegramUserId: payload.telegramUserId,
        //     };
        // });
        // EventService.subscribeEvent('edit-user', (payload: any) => {
        //     this.$data.action = 'edit';
        //     this.$data.form = {
        //         id: payload._id,
        //         firstName: payload.firstName,
        //         lastName: payload.lastName,
        //         username: payload.username,
        //         telegramUserId: payload.telegramUserId,
        //     };
        // });
        //
        // EventService.subscribeEvent('addUser', (payload: any) => {
        //     this.$nextTick(() => {
        //         this.$bvModal.hide('my-modal');
        //
        //         EventService.sendEvent('reload', {});
        //     })
        // });
        //
        // EventService.subscribeEvent('editUser', (payload: any) => {
        //     this.$nextTick(() => {
        //         this.$bvModal.hide('my-modal');
        //
        //         EventService.sendEvent('reload', {});
        //     })
        // });
    }

    // tuidDisbaled() {
    //     return false;
    // }
    //
    onSave() {
        console.log(this.$data.form.file);
        this.$store.dispatch(this.$data.action === 'add' ? 'addOrder' : 'editOrder', this.$data.form);
    }

    storeDocument(files: any) {
        this.$data.form.file = files[0];
    }

    close() {
        this.$bvModal.hide('order-modal');
    }
}
</script>

<style lang="scss">
.nowrap {
    white-space: nowrap;
}
.modal-md {
    // max-width: 700px;
}
</style>
