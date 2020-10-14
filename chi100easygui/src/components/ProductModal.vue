<template>
    <div>
        <b-modal id="product-modal" hide-footer>
            <template v-slot:modal-title>
                Create or Edit product
            </template>
            <div class="d-block text-center">
                <b-container>
                <b-row>
                    <b-col md="4">Категорія</b-col>
                    <b-col md="8">
                        <b-form-select name="category" v-model="form.category" :options="productCategories">
                        </b-form-select>
                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="4">Код виробу</b-col>
                    <b-col md="8"><b-input type="text" placeholder="Код виробу" name="externalIdentifier" v-model="form.externalIdentifier" /></b-col>
                </b-row>
                <b-row>
                    <b-col md="4">Найменування</b-col>
                    <b-col md="8"><b-input type="text" placeholder="Найменування" name="name" v-model="form.name" /></b-col>
                </b-row>
                <b-row>
                    <b-col md="4">Ціна</b-col>
                    <b-col md="8"><b-input type="text" placeholder="Ціна" name="price" v-model="form.price"/></b-col>
                </b-row>
<!--                <b-row>-->
<!--                    <b-col md="4">Currency</b-col>-->
<!--                    <b-col md="8"><b-input type="text" placeholder="Enter currency" name="currency" v-model="form.currency"/></b-col>-->
<!--                </b-row>-->
                </b-container>
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
import {Component, Prop, Vue} from "vue-property-decorator";

@Component({})
export default class AddUserModal extends Vue {

    data() {
        return {
            action: 'add',
            form: {
                name: '',
                price: '',
                currency: '',
                externalIdentifier: '',
                category: '',
            },
            productCategories: [{
                value: 'CLOSE&CLEAN',
                text: 'Чистка одягу'
            }, {
                value: 'HOME&TEXTILE',
                text: 'Домашні речі та текстіль'
            }, {
                value: 'LEATHER&FUR',
                text: 'Шкіряні та хутрові вироби'
            }, {
                value: 'REPAIR',
                text: 'Ремон одягу'
            }],
        };
    }

    mounted() {
        EventService.subscribeEvent('add-product', (payload: any) => {
            this.$data.action = 'add';
            this.$data.form = {
                name: payload.name,
                price: payload.price,
                currency: payload.currency,
                externalIdentifier: payload.externalIdentifier,
                category: payload.category,
            };
        });
        EventService.subscribeEvent('edit-product', (payload: any) => {
            this.$data.action = 'edit';
            this.$data.form = {
                id: payload._id,
                name: payload.name,
                price: payload.price,
                currency: payload.currency,
                externalIdentifier: payload.externalIdentifier,
                category: payload.category,
            };
        });

    }

    onSave() {
        this.$store.dispatch(this.$data.action === 'add' ? 'addProduct' : 'editProduct', this.$data.form);
    }
}
</script>

<style>

</style>
