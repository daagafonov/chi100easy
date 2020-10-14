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

            <div>
                <b-card no-body>
                    <b-tabs card @activate-tab="tabActivated" v-model="activatedIndex">

                        <b-tab v-for="item in productCategories" :key="item.key" :title="item.label" lazy @click="clicked(item.key)">
                            <b-table id="itemsTable"
                                     hover
                                     striped
                                     caption-top
                                     responsive
                                     :items="items"
                                     :fields="fields"
                                     :filter="filter"
                                     primary-key="_id"
                                     style="max-height: 555px; overflow-y: auto; "
                                     sticky-header
                            >
                                <template v-slot:cell(actions)="row">
                                    <b-button size="sm" @click="deleteFn(row.item, row.index, $event.target)">
                                        Delete
                                    </b-button>
                                </template>
                            </b-table>
                        </b-tab>

                    </b-tabs>
                </b-card>
            </div>
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

    private productCategories = [{
        key: 'CLOSE&CLEAN',
        label: 'Чистка одягу',
    }, {
        key: 'HOME&TEXTILE',
        label: 'Домашні речі та текстіль',
    }, {
        key: 'LEATHER&FUR',
        label: 'Шкіряні та хутрові вироби',
    }, {
        key: 'REPAIR',
        label: 'Ремон одягу',
    }];

    clicked(type: string) {
        console.log(type);
        this.$store.dispatch('getProducts', {
            category: type,
        });
    }

    tabActivated(newTI: number, prevTI?: number, evt?: any) {
        this.$store.dispatch('getProducts', {
            category: this.productCategories[newTI].key,
        });
    }

    data() {
        return {
            items: [],
            filter: '',
            fields: [{
                key: 'externalIdentifier', label: 'Код виробу', sortable: true
            }, {
                key: 'name', label: 'Найменування', sortable: true
            }, {
                key: 'price', label: 'Ціна', sortable: true
            }, {
                key: 'actions',
                label: 'Действия'
            }],
            activatedIndex: 0,
        };
    }

    created() {

        EventService.subscribeEvent('addProduct', (payload: any) => {
            this.$bvModal.hide('product-modal');
            EventService.sendEvent('reload', payload);
        });
        EventService.subscribeEvent('editProduct', (payload: any) => {
            this.$bvModal.hide('product-modal');
            EventService.sendEvent('reload', payload);
        });

        EventService.subscribeEvent('getProducts', (payload: any) => {
            this.$data.items = [];
            for (var i in payload.payload) {
                this.$data.items.push(payload.payload[i]);
            }
        });

        EventService.subscribeEvent('reload', (payload: any) => {
            this.$store.dispatch('getProducts', {
                category: payload.category,
            });
        });
    }

    mounted() {
        this.tabActivated(0);
    }

    addProduct(event: any) {
        EventService.sendEvent('add-product', {
            category: this.productCategories[this.$data.activatedIndex].key,
            currency: 'UAH'
        });
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
            category: this.productCategories[this.$data.activatedIndex].key,
        });
    }

    getCategory(item: any) {
        return this.productCategories.filter(v => v.key === item.category)[0].label;
    }

}
</script>
<style>

</style>
