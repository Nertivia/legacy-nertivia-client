<template>
  <div class="users-panel">
    <div class="title">Online Users</div>
    <div class="list">
      <user-template v-for="user in users" :key="user.id" :user="user" />
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
      users: null
    };
  },
  async mounted() {
    const { ok, result } = await adminService.fetchOnlineUsers();
    if (ok) {
      this.users = result.data;
    }
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
</style>
