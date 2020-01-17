<template>
  <div class="drop-down-menu" v-click-outside="outsideClick">
    <div class="item" @click="createInvite">
      <div class="material-icons">settings</div>
      <div class="name">Manage Invites</div>
    </div>
    <div
      class="item"
      v-if="checkServerCreator || hasAdminRoles"
      @click="showSettings"
    >
      <div class="material-icons">settings</div>
      <div class="name">Server Settings</div>
    </div>
    <div class="item warn" v-if="!checkServerCreator" @click="leaveServer">
      <div class="material-icons">exit_to_app</div>
      <div class="name">Leave Server</div>
    </div>
    <div class="item" @click="copyServerID">
      <div class="material-icons">developer_board</div>
      <div class="name">Copy ID</div>
    </div>
  </div>
</template>

<script>
import { permissions, containsPerm } from "@/utils/RolePermissions";
import ServerService from "../../../../services/ServerService";
export default {
  data() {
    return {};
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setAllPopout", {
        show: false,
        type: null
      });
    },
    outsideClick(event) {
      if (event.target.classList.contains("options-button")) return;
      this.closeMenu();
    },
    setPosition() {
      const y = this.contextDetails.y;
      const x = this.contextDetails.x;

      this.$el.style.top = y + "px";
      this.$el.style.left = x + "px";
    },
    showSettings() {
      this.closeMenu();
      this.$store.dispatch("setServerSettings", {
        serverID: this.contextDetails.serverID
      });
    },
    createInvite() {
      this.closeMenu();
      this.$store.dispatch("setPopoutVisibility", {
        name: "showServerInviteMenu",
        visibility: true
      });
    },
    async leaveServer() {
      this.closeMenu();
      await ServerService.leaveServer(this.contextDetails.serverID);
    },
    copyServerID() {
      this.closeMenu();
      this.$clipboard(this.contextDetails.serverID);
    }
  },
  mounted() {
    this.setPosition();
  },
  watch: {
    contextDetails() {
      this.setPosition();
    }
  },
  computed: {
    contextDetails() {
      return this.$store.getters.popouts.allPopout;
    },
    user() {
      return this.$store.getters.user;
    },
    checkServerCreator() {
      return this.contextDetails.creatorUniqueID === this.user.uniqueID;
    },
    serverMember() {
      return this.$store.getters["servers/serverMembers"].find(
        sm =>
          sm.server_id === this.contextDetails.serverID &&
          sm.uniqueID === this.user.uniqueID
      );
    },
    myRolePermissions() {
      if (!this.serverMember) return undefined;
      const roles = this.$store.getters["servers/roles"][
        this.contextDetails.serverID
      ];
      if (!roles) return undefined;

      let perms = 0;

      if (this.serverMember.roles) {
        for (let index = 0; index < roles.length; index++) {
          const role = roles[index];
          if (this.serverMember.roles.includes(role.id)) {
            perms = perms | (role.permissions || 0);
          }
        }
      }

      const defaultRole = roles.find(r => r.default);
      perms = perms | defaultRole.permissions;
      return perms;
    },
    hasAdminRoles() {
      const adminPermsFlags =
        permissions.MANAGE_CHANNELS.value |
        permissions.MANAGE_ROLES.value |
        permissions.ADMIN.value;
      return containsPerm(this.myRolePermissions, adminPermsFlags);
    }
  }
};
</script>

<style lang="scss" scoped>
.drop-down-menu {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  z-index: 99999;
  user-select: none;
  color: white;
  overflow: hidden;
  border-radius: 4px;
}

.item {
  display: flex;
  align-items: center;
  padding: 10px;
  transition: 0.2s;
  font-size: 13px;
  cursor: pointer;
  .material-icons {
    font-size: 20px;
    margin-right: 5px;
  }
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  &.warn {
    color: rgb(255, 59, 59);
  }
}
</style>
