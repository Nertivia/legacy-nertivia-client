<template>
  <div class="content-inner" v-if="server">
    <div class="warning">
      Are you sure you want to delete <strong>{{ server.name }}</strong
      >? This cannot be <strong>UNDONE!</strong>
    </div>
    <div class="button" @click="deleteServer()">
      {{ confirmed ? "ARE YOU SURE?" : "DELETE SERVER" }}
    </div>
  </div>
</template>

<script>
import ServerService from "@/services/ServerService";
export default {
  components: {},
  data() {
    return {
      confirmed: false
    };
  },
  methods: {
    async deleteServer() {
      if (!this.confirmed) {
        return (this.confirmed = true);
      }
      const { ok } = await ServerService.leaveServer(this.server.server_id);
      if (ok) {
        this.$store.dispatch("setServerSettings", { serverID: null });
      }
    }
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    }
  }
};
</script>

<style scoped>
.content-inner {
  display: flex;
  flex-direction: column;
}
.warning {
  background: red;
  padding: 10px;
  margin-bottom: 10px;
}
.button {
  padding: 10px;
  background: rgba(255, 0, 0, 0.719);
  margin: auto;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
}
.button:hover {
  background: rgb(255, 0, 0);
}
</style>
