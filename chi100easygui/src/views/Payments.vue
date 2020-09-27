<template>
    <div id="payment">
        <b-form>
            <b-form-group>
                <b-row>
                    <b-col md="6">
                        <b-form-input v-model="filter"></b-form-input>
                    </b-col>
                </b-row>
            </b-form-group>
            <b-table id="itemsTable" hover striped caption-top responsive
                     :items="items"
                     :fields="fields"
                     :filter="filter"
            >
                <template v-slot:table-caption>Платежи</template>
            </b-table>
        </b-form>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import EventService from "@/services/event.service";

@Component({})
export default class Payments extends Vue {
    data() {
        return {
            items: [],
            filter: null,
            fields: [{
                key: 'merchantAccount', label: 'Код магазина'
            },{
                key: 'orderReference', label: 'Код заказа'
            },{
                key: 'amount',  label: 'Общая сумма'
            }, {
                key: 'currency', label: 'Валюта'
            },{
                key: 'transactionStatus', label: 'Статус транзакции'
            },{
                key: 'fee', label: 'Комиссия'
            }]
        };
    }

    created() {
        this.$store.dispatch('getPayments', {

        });

        EventService.subscribeEvent('getPayments', (payload: any) => {
            this.$data.items = [];
            for (var i in payload.payload) {
                this.$data.items.push(payload.payload[i]);
            }
        });
    }
}
</script>

<style lang="scss">

</style>
