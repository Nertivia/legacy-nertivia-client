<template>
  <div class="users-panel">
    <div class="title">{{ $t("manage-servers") }}</div>
    <input
      class="search"
      autocomplete="off"
      type="text"
      placeholder="Search for server name | server id"
      @input="inputEvent"
    />
    <div class="list">
      <server-template
        v-for="server in searchedServers || servers"
        :key="server.server_id"
        :server="server"
      />
    </div>
  </div>
</template>

<script>
import ServerTemplate from "./ServerTemplate";
import adminService from "@/services/adminService";

export default {
  components: { ServerTemplate },
  data() {
    return {
      servers: null,
      searchedServers: null
    };
  },
  methods: {
    async recentServers() {
      const { ok, result } = await adminService.fetchRecentCreatedServers();
      if (ok) {
        this.servers = result.data;
      }
    },
    async inputEvent(event) {
      const value = event.target.value;
      if (value.trim() == "") {
        this.searchedServers = null;
        await this.recentServers();
        return;
      }
      const { ok, result } = await adminService.fetchSearchServers(value);
      if (ok) {
        this.searchedServers = result.data;
      }
    }
  },
  async mounted() {
    await this.recentServers();
  }
};
</script>

<style lang="scss" scoped>
.users-panel {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.2);
  height: 100%;
  width: 300px;
  margin-left: 5px;
  margin-right: 5px;
}
.title {
  background: rgba(0, 0, 0, 0.4);
  padding: 5px;
  text-align: center;
}
.list {
  overflow: auto;
}
.search {
  width: initial;
  margin: 0;
  height: 10px;
}
</style>
