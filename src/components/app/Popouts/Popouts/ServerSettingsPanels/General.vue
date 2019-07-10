<template>
    <div class="content-inner">
      <div class="top">
        <div class="server-avatar"></div>
        <div class="server-name">{{server.name}}</div>
      </div>
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
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID
      return this.$store.getters['servers/servers'][serverID]
    }
  }
};
</script>

<style scoped>
.server-avatar {
  background: grey;
  height: 90px;
  width: 90px;
  border-radius: 50%;
}
.top {
  margin: 10px;
  display: flex;
}
.server-name {
  align-self: center;
  margin-left: 10px;

}
</style>



