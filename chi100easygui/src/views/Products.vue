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
                            <b-button v-b-modal.product-modal @click="addProduct($event)" variant="success">Add Product</b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
            </b-form>
            <b-table id="itemsTable" hover striped caption-top responsive
                     :items="items"
                     :fields="fields"
                     :filter="filter"
            >
                <template v-slot:table-caption>Прайс лист</template>

                <template v-slot:cell(actions)="row">
                    <b-button size="sm" v-b-modal.product-modal @click="details(row.item, row.index, $event.target)"
                              class="mr-1">
                        Details
                    </b-button>
                    <b-button size="sm" @click="deleteFn(row.item, row.index, $event.target)">
                        Delete
                    </b-button>
                </template>
            </b-table>
        </div>

        <productModal></productModal>
    </div>
</template>
<script lang="ts">
import {Component, Vue} from 'vue-property-decorator';
import ProductModal from "@/components/ProductModal.vue";
import EventService from "@/services/event.service";

@Component({
    components: {
        'productModal': ProductModal,
    }
})
export default class ProductsComponent extends Vue {

    data() {
        return {
            items: [],
            filter: '',
            fields: [{
                key: 'category', label: 'Категория'
            }, {
                key: 'externalIdentifier', label: 'Код изделия'
            }, {
                key: 'name', label: 'Название'
            }, {
                key: 'price', label: 'Цена'
            }, {
                key: 'actions',
                label: 'Действия'
            }]
        };
    }

    created() {

        this.$store.dispatch('getProducts', {});

        EventService.subscribeEvent('addProduct', (payload: any) => {
            this.$bvModal.hide('product-modal');
            EventService.sendEvent('reload', {});
        });
        EventService.subscribeEvent('editProduct', (payload: any) => {
            this.$bvModal.hide('product-modal');
            EventService.sendEvent('reload', {});
        });

        EventService.subscribeEvent('getProducts', (payload: any) => {
            this.$data.items = [];
            for (var i in payload.payload) {
                this.$data.items.push(payload.payload[i]);
            }
        });

        EventService.subscribeEvent('reload', (payload: any) => {
            this.$store.dispatch('getProducts', {});
        });
    }

    addProduct(event: any) {
        EventService.sendEvent('add-product', {});
    }

    deleteProduct(userId: string) {
        // delete by id
    }

    details(item: any, index: any, event: any) {
        EventService.sendEvent('edit-product', item);
    }

    deleteFn(item: any, index: any, event: any) {
        this.$store.dispatch('removeProduct', {
            id: item._id,
        });
    }

}
</script>
<style>

</style>
