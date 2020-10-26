<template>
    <div>

        <context-menu
            ref="menuitem"
            element-id="aaa"
            :options="[{
                name: 'Редактировать',
                slug: 'edit',
            },{
              name: 'Удалить',
              slug: 'delete'
            }]"
            @option-clicked="optionClicked"
        >
            menuItem
        </context-menu>


        <div class="items">
            <b-form>
                <b-form-group>
                    <b-row>
                        <b-col md="10">
                            <b-form-input v-model="filter"></b-form-input>
                        </b-col>
                        <b-col md="2">
                            <b-button v-b-modal:offer-modal @click="addOffer($event)" variant="success">Add Offer</b-button>
                        </b-col>
                    </b-row>
                </b-form-group>
                <b-table id="itemsTable" hover striped caption-top responsive
                         :items="items"
                         :fields="fields"
                         :filter="filter"
                         @row-contextmenu="contextMenuFired"
                >
                    <template v-slot:table-caption>Акции ...</template>

                    <template v-slot:cell(validFrom)="row">
                        {{format(row.value)}}
                    </template>
                    <template v-slot:cell(validTo)="row">
                        {{format(row.value)}}
                    </template>
                </b-table>
            </b-form>
        </div>
        <offer-modal></offer-modal>
    </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import EventService from "@/services/event.service";
import moment from "moment";
import ContextMenuComponent from "@/components/ContextMenu.vue";
import OfferModalComponent from "@/components/OfferModalComponent.vue";

@Component({
    components: {
        'offer-modal': OfferModalComponent,
        'context-menu': ContextMenuComponent,
    }
})
export default class OffersComponent extends Vue {
    data() {
        return {
            items: [],
            filter: null,
            fields: [{
                key: 'shortDescription',
                label: 'Короткое описание',
            }, {
                key: 'validFrom',
                label: 'Годен c',
            }, {
                key: 'validTo',
                label: 'Годен до',
            }]
        };
    }

    getOffers() {
        this.$store.dispatch('getOffers', {

        });
    }

    created() {

        this.getOffers();

        EventService.subscribeEvent('getOffers', (payload: any) => {
            this.$data.items = [];
            for (var i in payload.payload) {
                this.$data.items.push(payload.payload[i]);
            }
        });

        EventService.subscribeEvent('reloadOffers', (payload: any) => {
            this.getOffers();
        });

        EventService.subscribeEvent('addOffer', (payload: any) => {
            this.$bvModal.hide('offer-modal');
            EventService.sendEvent('reloadOffers', {});
        });
    }

    format(value: any) {
        return moment(value).format('YYYY-MM-DD');
    }

    clickContextMenu(event: any, menuItem: any, item: any) {
        menuItem.showMenu(event, item);
    }

    addOffer(event: any) {

    }

    optionClicked(paylaod: any) {
        const {item, option} = paylaod;
        if (option && option.slug && option.slug === 'edit') {

        }

        if (option && option.slug && option.slug === 'delete') {

        }
    }

    contextMenuFired(item: any, index: any, event: any) {
        event.preventDefault();
        this.clickContextMenu(event, this.$refs.menuitem, item);
    }

}
</script>

<style lang="scss">

</style>
