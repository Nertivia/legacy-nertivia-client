<template>
  <div class="admin-panel-tab">
    <users-panel />
    <online-users-panel />
    <themes-panel />
  </div>
</template>

<script>
import { bus } from "@/main";

import UsersPanel from "./AdminPanel/UsersPanel";
import OnlineUsersPanel from "./AdminPanel/OnlineUsersPanel";
import ThemesPanel from "./AdminPanel/ThemesPanel";

export default {
  components: { UsersPanel, OnlineUsersPanel, ThemesPanel },
  data() {
    return {};
  },
  methods: {},
  mounted() {
    if (!this.isAdmin) {
      bus.$emit("tab:switch", 0);
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    isAdmin() {
      return this.user.admin === 3 || this.user.admin === 4;
    }
  }
};
</script>

<style lang="scss" scoped>
.admin-panel-tab {
  display: flex;
  width: 100%;
  height: 100%;
  color: white;
  position: relative;
}
</style>
