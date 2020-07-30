<template>
  <div class="dark-background server-settings-popout">
    <div class="inner">
      <div class="tabs">
        <div
          class="tab"
          v-for="tab in tabsFiltered"
          :key="tab.index"
          :class="{ selected: index === tab.index, critical: tab.critical }"
          @click="index = tab.index"
        >
          <div class="material-icons">{{ tab.icon }}</div>
          <div>{{ tab.title }}</div>
        </div>
      </div>
      <div class="content">
        <div class="close-button-desktop" @click="closeMenu">
          <div class="material-icons">close</div>
        </div>
        <div class="header" :class="{ critical: tabs[index].critical }">
          <div class="material-icons">{{ tabs[index].icon }}</div>
          <div>{{ tabs[index].title }}</div>
          <div class="close-button" @click="closeMenu">
            <div class="material-icons">close</div>
          </div>
        </div>
        <general v-if="index === 0" />
        <manage-channels v-if="index === 1" />
        <manage-roles v-if="index === 2" />
        <server-invite-popout v-if="index === 3" />
        <manage-bans v-if="index === 4" />
        <server-visibility v-if="index === 5" />
        <delete-server v-if="index === 6" />
      </div>
    </div>
  </div>
</template>

<script>
// panels
const General = () => import("./General.vue");
const DeleteServer = () => import("./DeleteServer.vue");
const ManageChannels = () => import("./ManageChannels.vue");
const ManageRoles = () => import("./ManageRoles.vue");
const ManageBans = () => import("./ManageBans.vue");
const ServerVisibility = () => import("./ServerVisibility.vue");
const ServerInvitePopout = () => import("../ServerInvitePopout");

import { permissions, containsPerm } from "@/utils/RolePermissions";

export default {
  props: ["defaultIndex"],
  components: {
    General,
    DeleteServer,
    ManageChannels,
    ServerVisibility,
    ServerInvitePopout,
    ManageBans,
    ManageRoles
  },
  data() {
    return {
      index: this.$store.state.popoutsModule.serverSettings.index || 0
    };
  },

  methods: {
    closeMenu() {
      this.$store.dispatch("setServerSettings", {
        serverID: null
      });
    }
  },
  mounted() {},
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    },
    user() {
      return this.$store.getters.user;
    },
    checkServerCreator() {
      return this.server.creator.uniqueID === this.user.uniqueID;
    },
    serverMember() {
      return this.$store.getters["servers/serverMembers"].find(
        sm =>
          sm.server_id === this.server.server_id &&
          sm.uniqueID === this.user.uniqueID
      );
    },
    myRolePermissions() {
      if (!this.serverMember) return undefined;
      const roles = this.$store.getters["servers/roles"][this.server.server_id];
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
    tabs() {
      return [
        {
          title: "General",
          icon: "info",
          index: 0,
          shown: this.checkServerCreator
        },
        {
          title: "Channels",
          icon: "storage",
          index: 1,
          shown:
            this.checkServerCreator ||
            !!containsPerm(
              this.myRolePermissions,
              permissions.ADMIN.value | permissions.MANAGE_CHANNELS.value
            )
        },
        {
          title: "Roles",
          icon: "extension",
          index: 2,
          shown:
            this.checkServerCreator ||
            !!containsPerm(
              this.myRolePermissions,
              permissions.ADMIN.value | permissions.MANAGE_ROLES.value
            )
        },
        // {title: "Manage Invites", icon: "local_post_office"},
        {
          title: "Manage Invites",
          icon: "settings",
          index: 3,
          shown: true
        },
        {
          title: "Banned Members",
          icon: "lock",
          index: 4,
          shown: this.checkServerCreator
        },
        {
          title: "Server Visibility",
          icon: "visibility",
          index: 5,
          shown: this.checkServerCreator
        },
        {
          title: "Delete Server",
          icon: "warning",
          critical: true,
          index: 6,
          shown: this.checkServerCreator
        }
      ];
    },
    tabsFiltered() {
      return this.tabs.filter(t => t.shown === true);
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global";
.dark-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 111111;
  display: flex;
}
.inner {
  margin: auto;
  width: 100%;
  margin: 40px;
  display: flex;
  color: white;
  overflow: hidden;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: $other-box-color;
  border-radius: 4px;
  backdrop-filter: blur(5px);
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.tabs {
  display: flex;
  flex-direction: column;
  background: #272e37da;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
  height: 100%;
  width: 180px;
  flex-shrink: 0;
}
.tab {
  padding: 5px;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-content: center;
  flex-shrink: 0;
  font-size: 15px;
  .material-icons {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.8);
  }
}

.close-button-desktop {
  background: rgba(255, 255, 255, 0.1);
  transition: 0.2s;
  border-radius: 5px;
  margin: 5px;
  height: 23px;
  user-select: none;
  position: absolute;
  right: 0;
  top: 0;
  align-self: flex-end;
  z-index: 1111111;
  cursor: pointer;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}

.tab .material-icons {
  margin-right: 5px;
}
.tab div {
  align-self: center;
}
.tab:hover {
  background: rgba(255, 255, 255, 0.1);
}
.critical {
  color: red;
}
.tab.selected {
  background: linear-gradient(
    137deg,
    rgba(45, 136, 255, 1) 0%,
    rgba(87, 160, 255, 1) 100%
  );
}
.header {
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  height: 50px;
  display: none;
  flex-shrink: 0;
  width: 100%;
  user-select: none;
  cursor: default;
}
.header div {
  align-self: center;
  margin-left: 10px;
}

.close-button {
  display: flex;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
  position: absolute;
  top: 5px;
  right: 5px;
}
.close-button:hover {
  background: rgba(37, 37, 37, 0.692);
}
.close-button .material-icons {
  margin: auto;
  font-size: 30px;
}

@media (max-width: 614px) {
  .header {
    display: flex;
  }
  .close-button-desktop {
    display: none;
  }
  .close-button {
    top: 55px;
  }
  .inner {
    margin: 0;
    border-radius: 0;
    max-height: initial;
    flex-direction: column;
  }
  .tabs {
    width: 100%;
    height: 50px;
    flex-direction: row;
    overflow: auto;
  }
  .tabs::-webkit-scrollbar {
    height: 5px;
  }
}
</style>
