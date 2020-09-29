<template>
    <div class="container">
        Logged out
    </div>
</template>

<script lang="ts">

import {Component, Vue} from "vue-property-decorator";
import EventService from "@/services/event.service";
import router from "@/router";

@Component({

})
export default class LoginComponent extends Vue {

    created() {
        this.$store.dispatch('logout', {
        });
    }

    beforeMount() {
        EventService.subscribeEvent('loggedout', (payload: any) => {
            router.push({
                name: 'Home'
            });
        });
    }
}
</script>

<style lang="scss">
.bold {
    font-weight: bold;
}
</style>
