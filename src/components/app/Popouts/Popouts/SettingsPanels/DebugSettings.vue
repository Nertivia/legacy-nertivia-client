<template>
  <div class="panel">
    <div class="toolbar">
      <div class="button" @click="printUser">User</div>
      <div class="button" @click="printNotifications">Notifications</div>
      <div class="button" @click="printAll">All</div>
      <div class="button" @click="vuexLogButton">Log Vuex</div>
    </div>
    <div class="log">
      <code>{{ view }}</code>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      view: "Click on tabs above to see data."
    };
  },
  methods: {
    vuexLogButton() {
      alert("Vuex logged to console.");
      console.log(this.$store);
    },
    printUser() {
      const user = JSON.parse(this.stateFiltered).user.user;
      user.friends = undefined;
      this.view = JSON.stringify(user, null, 2);
    },
    printNotifications() {
      const notifications = this.$store.state.notificationsModule;
      this.view = JSON.stringify(notifications, null, 2);
    },
    printAll() {
      this.view = this.stateFiltered;
    }
  },
  computed: {
    stateFiltered() {
      // without stringifying it, data is still reactive.
      const state = { ...JSON.parse(JSON.stringify(this.$store.state)) };
      state.user.token = "hidden";
      state.user.user.email = "hidden";
      return JSON.stringify(state, null, 2);
    }
  }
};
</script>

<style scoped lang="scss">
.panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.toolbar {
  display: flex;
  height: 30px;
  overflow: hidden;
  .button {
    display: flex;
    align-content: center;
    align-items: center;
    padding: 10px;
    margin-right: 1px;
    cursor: pointer;
    background: rgba(0, 0, 0, 0.3);
    &:hover {
      background: rgba(0, 0, 0, 0.6);
    }
  }
}
.log {
  background: black;
  height: 100%;
  overflow: auto;
  padding: 10px;
  code {
    white-space: pre;
  }
}
</style>
