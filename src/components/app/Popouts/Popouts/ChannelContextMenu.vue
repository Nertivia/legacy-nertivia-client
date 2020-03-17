<template>
  <div class="drop-down-menu" v-click-outside="outsideClick">
    <div
      class="item"
      @click="markAsReadButton"
      :class="{ disabled: !notificationsExist }"
    >
      <div class="material-icons">markunread_mailbox</div>
      <div class="name">Mark As Read</div>
    </div>

    <div class="item" v-if="isMuted" @click="unmuteServer">
      <div class="material-icons">notifications</div>
      <div class="name">Unmute Channel</div>
    </div>

    <div class="item warn" v-else @click="muteServer">
      <div class="material-icons">notifications_off</div>
      <div class="name">Mute Channel</div>
    </div>

    <div class="item" @click="copyChannelID">
      <div class="material-icons">developer_board</div>
      <div class="name">Copy ID</div>
    </div>
  </div>
</template>

<script>
import serverService from "@/services/ServerService";
import { permissions, containsPerm } from "@/utils/RolePermissions";
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
      let y = this.contextDetails.y;
      let x = this.contextDetails.x;

      // if context is out of screen
      if (x + this.$el.clientWidth > window.innerWidth) {
        x = window.innerWidth - this.$el.clientWidth;
      }
      if (y + this.$el.clientHeight > window.innerHeight) {
        y = window.innerHeight - this.$el.clientHeight;
      }

      this.$el.style.top = y + "px";
      this.$el.style.left = x + "px";
    },
    markAsReadButton() {
      if (!this.notificationsExist) return;
      this.closeMenu();
      this.$socket.client.emit("notification:dismiss", {
        channelID: this.contextDetails.channelID
      });
    },
    showSettings() {
            this.closeMenu();
      this.$store.dispatch("setServerSettings", {
        serverID: this.contextDetails.serverID
      });
    },
    async muteServer() {
      this.closeMenu();
      await serverService.muteChannel(
        this.contextDetails.serverID,
        this.contextDetails.channelID
      );
    },
    async unmuteServer() {
      this.closeMenu();
      await serverService.unmuteChannel(
        this.contextDetails.serverID,
        this.contextDetails.channelID
      );
    },
    copyChannelID() {
      this.closeMenu();
      this.$clipboard(this.contextDetails.channelID);
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
    isMuted() {
      const mutedChannels = this.$store.getters.mutedChannels;
      return mutedChannels.includes(this.contextDetails.channelID);
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
    },
    notificationsExist() {
      const notifications = this.$store.getters.notifications;
      return notifications.find(
        n => n.channelID === this.contextDetails.channelID
      );
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
  color: rgba(255, 255, 255, 0.7);
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
    color: white;
  }
  &.warn {
    color: rgb(255, 59, 59);
  }
  &.disabled {
    cursor: default;
    background: transparent;
    color: rgba(255, 255, 255, 0.4);
  }
}
</style>
