<template>
  <div class="users-panel">
    <div class="title">Manage Accounts</div>
    <input
      class="search"
      autocomplete="off"
      type="text"
      placeholder="Search for user:tag | user id"
      @input="inputEvent"
    />
    <div class="list">
      <user-template
        v-for="user in searchedUsers || users"
        :key="user.uniqueID"
        :user="user"
      />
    </div>
  </div>
</template>

<script>
import UserTemplate from "./UserTemplate";
import adminService from "@/services/adminService";

export default {
  components: { UserTemplate },
  data() {
    return {
      users: null,
      searchedUsers: null
    };
  },
  methods: {
    async recentUsers() {
      const { ok, result } = await adminService.fetchRecentCreatedUsers();
      if (ok) {
        this.users = result.data;
      }
    },
    async inputEvent(event) {
      const value = event.target.value;
      if (value.trim() == "") {
        this.searchedUsers = null;
        await this.recentUsers();
        return;
      }
      const { ok, result } = await adminService.fetchSearchUsers(value);
      if (ok) {
        this.searchedUsers = result.data;
      }
    }
  },
  async mounted() {
    await this.recentUsers();
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
