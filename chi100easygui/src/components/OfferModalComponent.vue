<template>
    <div>
        <b-modal id="offer-modal" hide-footer>
            <template v-slot:modal-title>
                Create or edit offer dialog
            </template>
            <div class="d-block text-center">
                <b-row>
                    <b-col md="3">shortDescription</b-col>
                    <b-col md="9"><b-textarea

                        rows="5"

                        placeholder="shortDescription"
                        name="shortDescription"
                        v-model="form.shortDescription"
                    ></b-textarea></b-col>
                </b-row>
                <b-row>
                    <b-col md="3">longDescription</b-col>
                    <b-col md="9">
                        <b-textarea
                            placeholder="longDescription"
                            name="longDescription"
                            v-model="form.longDescription"
                        />

<!--                        <editor-->
<!--                            v-model="form.longDescription"-->
<!--                            api-key="lot26ggblj571e1m04bbzp5pcaok5k161qp8du9slsuo20eb"-->
<!--                            :init="{-->
<!--                             height: 400,-->
<!--                             menubar: true,-->
<!--                             inlineEditor: true,-->
<!--                             plugins: [-->
<!--                               'advlist autolink lists link image charmap print preview anchor',-->
<!--                               'searchreplace visualblocks code fullscreen',-->
<!--                               'insertdatetime media table paste code help wordcount'-->
<!--                             ],-->
<!--                             toolbar:-->
<!--                               'undo redo | formatselect | bold italic backcolor | \-->
<!--                               alignleft aligncenter alignright alignjustify | \-->
<!--                               bullist numlist outdent indent | removeformat | help'-->
<!--                           }"-->
<!--                        />-->

                    </b-col>
                </b-row>
                <b-row>
                    <b-col md="3">Picturee</b-col>
                    <b-col md="9"><b-file type="file"
                                          placeholder="picture"
                                          name="picture"
                                          accept="image/png,image/jpg,image/jpeg"
                                          @change="storeDocument($event.target.files)"
                    /></b-col>
                </b-row>
                <b-row>
                    <b-col md="3">validFrom</b-col>
                    <b-col md="9"><b-form-datepicker
                        placeholder="YYYY-MM-DD"
                        name="validFrom"
                        v-model="form.validFrom"
                    /></b-col>
                </b-row>
                <b-row>
                    <b-col md="3">validTo</b-col>
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

}
</script>

<style>

.modal-dialog {
    max-width: 800px;
}

</style>
