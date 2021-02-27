<template>
    <div>
        <b-modal id="offer-modal" hide-footer>
            <template v-slot:modal-title>
                Создание или редактирование предложения
            </template>
            <div class="d-block text-center">
                <b-row>
                    <b-col md="3">короткое описание</b-col>
                    <b-col md="9"><b-textarea

                        rows="5"

                        placeholder="Короткое описание"
                        name="shortDescription"
                        v-model="form.shortDescription"
                    ></b-textarea></b-col>
                </b-row>
                <b-row>
                    <b-col md="3">длинное описание</b-col>
                    <b-col md="9">
                        <b-textarea

                            rows="5"

                            placeholder="Длинное описание"
                            name="longDescription"
                            v-model="form.longDescription"
                        />

                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="3">Рисунок</b-col>
                    <b-col md="9"><b-file type="file"
                                          placeholder="Рисунок"
                                          name="picture"
                                          accept="image/png,image/jpg,image/jpeg"
                                          @change="storeDocument($event.target.files)"
                    /></b-col>
                </b-row>
                <b-row>
                    <b-col md="3">действителен с</b-col>
                    <b-col md="9"><b-form-datepicker
                        placeholder="YYYY-MM-DD"
                        name="validFrom"
                        v-model="form.validFrom"
                    /></b-col>
                </b-row>
                <b-row>
                    <b-col md="3">действителен до</b-col>
                    <b-col md="9"><b-form-datepicker
                        placeholder="YYYY-MM-DD"
                        name="validTo"
                        v-model="form.validTo"
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
import {Editor} from "@tinymce/tinymce-vue/lib/cjs/main/ts/components/Editor";

@Component({
    name: 'offer-modal',
    components: {
        'editor': Editor
    }
})
export default class OfferModalComponent extends Vue {
    data() {
        return {
            action: 'add',
            form: {
                shortDescription: '',
                longDescription: '',
                validFrom: '',
                validTo: '',

                file: ''
            }
        };
    }

    mounted() {

        EventService.subscribeEvent('add-offer', (payload: any) => {
            this.$data.action = payload.action;
            this.$data.form = payload.offer;
        });

        EventService.subscribeEvent('edit-offer', (payload: any) => {
            this.$data.action = payload.action;
            this.$data.form = payload.offer;
            this.$data.form._id = payload.offer._id;
            this.$bvModal.show('offer-modal');
        });

        EventService.subscribeEvent('editOffer', (payload: any) => {
            // this.$nextTick(() => {
                this.$bvModal.hide('offer-modal');

                EventService.sendEvent('reloadOffers', {});
            // });
        });

    }

    onSave() {

        console.log(this.$data.form);

        this.$store.dispatch(this.$data.action === 'add' ? 'addOffer' : 'editOffer', this.$data.form);
    }

    storeDocument(files: any) {
        this.$data.form.file = files[0];
    }

    close() {
        this.$bvModal.hide('offer-modal');
    }
}
</script>

<style>

.modal-dialog {
    max-width: 800px;
}

</style>
