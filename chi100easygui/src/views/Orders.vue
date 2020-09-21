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
                            <b-button v-b-modal:order-modal @click="addOrder($event)" variant="success">Add Order</b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-table id="itemsTable" hover striped caption-top responsive
                         :items="items"
                         :fields="fields"
                         :filter="filter"
                >
                    <template v-slot:table-caption>Заказы ...</template>

                    <template v-slot:cell(actions)="row">
<!--                        <b-button size="sm" @click="save(row.item, row.index, $event.target)"-->
<!--                                  class="mr-1">-->
<!--                            Сохранить-->
<!--                        </b-button>-->
<!--                        <b-button v-if="row.item._id" size="sm" @click="details(row.item, row.index, $event.target)"-->
<!--                                  class="mr-1">-->
<!--                            Детали-->
<!--                        </b-button>-->
<!--                        <b-button v-if="row.item._id" variant="danger" size="sm" @click="delete(row.item, row.index, $event.target)">-->
<!--                            Удалить-->
<!--                        </b-button>-->
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
import OrderModal from "@/components/Order.vue";

@Component({
    components: {
        orderModal: OrderModal
    }
})
export default class OrdersComponent extends Vue {

    data() {
        return {
            items: [],
            filter: null,
            fields: [{
                key: 'comment',
            }, {
                key: 'finalCost'
            }, {
                key: 'actions',
                label: 'Actions'
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
    }

    addOrder(event: any) {
        EventService.sendEvent('order-modal', {
            userId: this.$route.query.userId,
        });
    }

    deleteOrder(userId: string) {
        // delete by id
    }

    save(item: any, index: any, event: any) {
        this.$store.dispatch('saveOrder', item);
    }

}
</script>
<style>

</style>
