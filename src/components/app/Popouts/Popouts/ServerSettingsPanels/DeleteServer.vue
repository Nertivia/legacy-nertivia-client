<template>
    <div class="content-inner">
      <div class="warning">Are you sure you want to delete <strong>{{server.name}}</strong>? This cannot be <strong>UNDONE!</strong></div>
      <div class="button" @click="deleteServer()">DELETE <strong>{{server.name}}</strong></div>
    </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import Spinner from "@/components/Spinner.vue";
import ServerService from "@/services/ServerService";
import { mapState } from "vuex";

export default {
  components: {Spinner},
  methods: {
    async deleteServer(){
      const {ok, error, result} = await ServerService.leaveServer(this.server.server_id);
      if (ok) {
        this.$store.dispatch('setServerSettings', {serverID: null})
      }
    }
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID
      return this.$store.getters['servers/servers'][serverID]
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
  border-radius: 10px;
  padding: 10px;
  margin: 10px;
}
.button {
  padding: 10px;
  background: rgba(255, 0, 0, 0.719);
  margin: auto;
  border-radius: 10px;
  transition: 0.3s;
  user-select: none;
}
.button:hover {
  background: rgb(255, 0, 0);
}
</style>


