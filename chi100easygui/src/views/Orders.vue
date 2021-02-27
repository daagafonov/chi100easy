<template>
    <div>
        <div class="items">
            <b-form>
                <b-form-group>
                    <b-row>
                        <b-col md="10">
                            <b-form-input v-model="filter"></b-form-input>
                        </b-col>
                        <b-col md="2">
                            <b-button v-b-modal:order-modal @click="addOrder($event)" variant="success">Создать заказ</b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-table id="itemsTable" hover striped caption-top responsive
                         :items="items"
                         :fields="fields"
                         :filter="filter"
                >
                    <template v-slot:table-caption>
                        <span>Заказы ...</span>
                        <b-button @click="updateList()" class="btn btn-success">Обновить список</b-button>
                    </template>

                    <template v-slot:cell(status)="row">
                        <span>{{translations[row.item.status]}}</span>
                    </template>

                    <template v-slot:cell(actions)="row">
                        <b-button v-if="row.item.status === 'CREATED'" size="sm" @click="sendDocument(row.item, row.index, $event.target)"
                                  class="mr-1">
                            Отправить документ
                        </b-button>
                    </template>
                </b-table>
            </b-form>
        </div>
        <order-modal></order-modal>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ProductModal from "@/components/ProductModal.vue";
import EventService from "@/services/event.service";
import OrderModal from "@/components/OrderModal.vue";

export const translations = {
    CREATED : 'Создан',
    SENT : 'Отправлен',
    CONFIRMED : 'Подтвержден',
    DECLINED : 'Отменен',
    PAID : 'Оплачен',
    REFUNDED : 'Вернули',
    IN_PROGRESS : 'В процессе',
    FINISHED : 'Завершен',
};

@Component({
    components: {
        orderModal: OrderModal
    }
})
export default class OrdersComponent extends Vue {

    data() {
        return {
            translations,
            items: [],
            filter: null,
            fields: [{
                key: 'externalOrderId',
                label: 'ID документа'
            }, {
                key: 'finalCost',
                label: 'Конечная сумма'
            }, {
                key: 'status',
                label: 'Статус'
            }, {
                key: 'actions',
                label: 'Действия'
            }]
        };
    }

    created() {

        this.$store.dispatch('getOrders', {
            userId: this.$route.query.userId,
        });

        EventService.subscribeEvent('addOrder', (payload: any) => {
            this.$bvModal.hide('order-modal');
            EventService.sendEvent('reloadOrders', {});
        });
        EventService.subscribeEvent('editOrder', (payload: any) => {
            EventService.sendEvent('reloadOrders', {});
        });

        EventService.subscribeEvent('getOrders', (payload: any) => {
            this.$data.items = [];
            for (var i in payload.payload) {
                this.$data.items.push(payload.payload[i]);
            }
        });

        EventService.subscribeEvent('reloadOrders', (payload: any) => {
            this.$store.dispatch('getOrders', {
                userId: this.$route.query.userId,
            });
        });

        EventService.subscribeEvent('sendDocument', (payload: any) => {
            this.sendDocumentResult(payload);
        });
    }

    addOrder(event: any) {
        EventService.sendEvent('order-modal', {
            userId: this.$route.query.userId,
        });
    }

    deleteOrder(userId: string) {
        // delete by id
    }

    sendDocument(item: any, index: any, event: any) {
        this.$store.dispatch('sendDocument', {
            orderId: item._id,
        });
    }

    sendDocumentResult(payload: any) {
        EventService.sendEvent('reloadOrders', {});
    }

    updateList() {
        this.$store.dispatch('getOrders', {
            userId: this.$route.query.userId,
        });
    }

}
</script>
<style>

</style>
