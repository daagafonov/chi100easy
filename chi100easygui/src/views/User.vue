<template>
  <div class="users">
    <div>Users, {{ greeting }}</div>
    <div v-for="(user, index) in userList1" :key="user._id">
      {{ index + 1 }}. {{ user.firstName }} {{user.lastName}} {{user.username}}
    </div>

  </div>
</template>

<script lang="ts">

import {mapState} from "vuex";

export default {
  name: 'User',
  data() {
    return {
      greeting: 'Hello',
      userList: [],
    };
  },
  computed: {
    ...mapState({
      userList1: state => state.users
    })
  },
  beforeMount() {
    this.$store.dispatch('getUsers', {});
  }
}
</script>
