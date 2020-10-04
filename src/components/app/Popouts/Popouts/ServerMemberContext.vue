<template>
  <div
    class="drop-down-menu server-member-context-popout"
    v-click-outside="outsideClick"
    @mouseleave="editRoleHovered = false"
  >
    <div class="roles-menu" ref="roles-menu" v-if="editRoleHovered">
      <div
        class="item roles"
        v-for="role in serverRoles()"
        :key="role.id"
        :style="{ color: role.color }"
        @click="role.hasRole ? removeRole(role.id) : addRole(role.id)"
      >
        <div class="has-role material-icons" v-if="role.hasRole">check</div>
        {{ role.name }}
      </div>
    </div>
    <div class="main-menu" ref="main-menu">
      <div class="item" @click="viewProfile">
        <div class="material-icons icon-cat">person</div>
        <div class="name">{{ $t("view-profile") }}</div>
      </div>
      <div class="item" @click="copyUserTag">
        <div class="material-icons icon-cat">developer_board</div>
        <div class="name">{{ $t("copy-user-tag") }}</div>
      </div>
      <div class="item" @click="copyID">
        <div class="material-icons icon-cat">developer_board</div>
        <div class="name">{{ $t("copy-id") }}</div>
      </div>
      <div
        class="item"
        @mouseenter="editRoleHoverEvent"
        v-if="isServerMember || hasManageRolePerm"
      >
        <div class="material-icons">keyboard_arrow_left</div>
        Edit Roles
      </div>
      <div
        class="item warn"
        v-if="showKickBanOption && hasKickPermission"
        @click="kickMember"
      >
        <div class="material-icons icon-cat">exit_to_app</div>
        <div class="name">{{ $t("kick") }}</div>
      </div>
      <div
        class="item warn"
        v-if="showKickBanOption && hasBanPermission"
        @click="banMember"
      >
        <img class="icon-cat" src="../../../../assets/hammer4.0.svg" />
        <div class="name">{{ $t("ban") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ServerService from "../../../../services/ServerService";
import { containsPerm, permissions } from "../../../../utils/RolePermissions";
export default {
  data() {
    return {
      editRoleHovered: false
    };
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setServerMemberContext", {
        server_id: null,
        uniqueID: null,
        x: null,
        y: null
      });
    },
    outsideClick() {
      this.closeMenu();
    },
    viewProfile() {
      const uniqueID = this.contextDetails.uniqueID;
      this.closeMenu();
      this.$store.dispatch("setUserInformationPopout", uniqueID);
    },
    copyUserTag() {
      const user = this.$store.getters["members/members"][
        this.contextDetails.uniqueID
      ];
      const userTag = user.username + ":" + user.tag;
      this.closeMenu();
      this.$clipboard(userTag);
    },
    copyID() {
      const uniqueID = this.contextDetails.uniqueID;
      this.$clipboard(uniqueID);
      this.closeMenu();
    },
    async kickMember() {
      const serverID = this.contextDetails.serverID;
      const uniqueID = this.contextDetails.uniqueID;
      this.closeMenu();
      await ServerService.kickMember(serverID, uniqueID);
    },
    async banMember() {
      const serverID = this.contextDetails.serverID;
      const uniqueID = this.contextDetails.uniqueID;
      this.closeMenu();
      await ServerService.banMember(serverID, uniqueID);
    },
    editRoleHoverEvent() {
      this.editRoleHovered = true;
      const mainMenu = this.$refs["main-menu"];
      this.$nextTick(() => {
        const rolesMenu = this.$refs["roles-menu"];

        let y = parseInt(mainMenu.style.top, 10) + 120;
        let x = parseInt(mainMenu.style.left, 10) - mainMenu.clientWidth - 21;

        if (y + rolesMenu.clientHeight > window.innerHeight) {
          y = window.innerHeight - rolesMenu.clientHeight;
        }
        rolesMenu.style.top = y + "px";

        rolesMenu.style.left = x + "px";
      });
    },
    setPosition() {
      let y = this.contextDetails.y;
      let x = this.contextDetails.x;
      const mainMenu = this.$refs["main-menu"];

      // if context is out of screen
      if (x + mainMenu.clientWidth > window.innerWidth) {
        x = window.innerWidth - mainMenu.clientWidth;
      }
      if (y + mainMenu.clientHeight > window.innerHeight) {
        y = window.innerHeight - mainMenu.clientHeight;
      }

      mainMenu.style.top = y + "px";
      mainMenu.style.left = x + "px";
    },
    async addRole(roleID) {
      this.$store.dispatch("servers/addMemberRole", {
        role_id: roleID,
        uniqueID: this.contextDetails.uniqueID,
        server_id: this.contextDetails.serverID
      });
      await ServerService.applyRoleToMember(
        this.contextDetails.serverID,
        roleID,
        this.contextDetails.uniqueID
      );
    },
    async removeRole(roleID) {
      this.$store.dispatch("servers/removeMemberRole", {
        role_id: roleID,
        uniqueID: this.contextDetails.uniqueID,
        server_id: this.contextDetails.serverID
      });
      await ServerService.removeRoleFromMember(
        this.contextDetails.serverID,
        roleID,
        this.contextDetails.uniqueID
      );
    },
    serverRoles() {
      const roles = this.$store.getters["servers/roles"][
        this.contextDetails.serverID
      ];
      const map = roles
        .filter(r => !r.default && !r.bot)
        .map(r => {
          if (
            this.serverMember.roles &&
            this.serverMember.roles.includes(r.id)
          ) {
            return Object.assign({}, r, { hasRole: true });
          }
          return r;
        });

      return map;
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
      const {
        x,
        y,
        serverID,
        uniqueID
      } = this.$store.getters.popouts.serverMemberContext;
      return {
        x,
        y,
        serverID,
        uniqueID
      };
    },
    // check if i am the server Owner.
    isServerMember() {
      const serverMembers = this.$store.getters["servers/serverMembers"];
      return serverMembers.find(
        m =>
          m.uniqueID === this.user.uniqueID &&
          m.server_id === this.contextDetails.serverID &&
          m.type === "OWNER"
      );
    },
    serverMember() {
      const serverMembers = this.$store.getters["servers/serverMembers"];
      return serverMembers.find(
        m =>
          m.uniqueID === this.contextDetails.uniqueID &&
          m.server_id === this.contextDetails.serverID
      );
    },
    user() {
      return this.$store.getters.user;
    },
    showKickBanOption() {
      // Dont show kick and ban option for Fishie and Fullipsp :P
      if (
        this.contextDetails.uniqueID === "763085765093499319" ||
        this.contextDetails.uniqueID === "825242960222351869"
      )
        return false;
      // Only show kick and ban option if the user is server owner and not us
      if (this.user.uniqueID === this.contextDetails.uniqueID) return false;
      return true;
    },
    selfServerMember() {
      return this.$store.getters["servers/serverMembers"].find(
        sm =>
          sm.server_id === this.contextDetails.serverID &&
          sm.uniqueID === this.user.uniqueID
      );
    },
    myRolePermissions() {
      if (!this.selfServerMember) return undefined;
      const roles = this.$store.getters["servers/roles"][
        this.contextDetails.serverID
      ];
      if (!roles) return undefined;

      let perms = 0;

      if (this.selfServerMember.roles) {
        for (let index = 0; index < roles.length; index++) {
          const role = roles[index];
          if (this.selfServerMember.roles.includes(role.id)) {
            perms = perms | (role.permissions || 0);
          }
        }
      }

      const defaultRole = roles.find(r => r.default);
      perms = perms | defaultRole.permissions;
      return perms;
    },
    hasManageRolePerm() {
      return containsPerm(
        this.myRolePermissions,
        permissions.MANAGE_ROLES.value | permissions.ADMIN.value
      );
    },
    hasKickPermission() {
      if (this.selfServerMember.type === "OWNER") return true;
      if (this.serverMember.type === "OWNER") return false;
      return containsPerm(
        this.myRolePermissions,
        permissions.KICK_USER.value | permissions.ADMIN.value
      );
    },
    hasBanPermission() {
      if (this.selfServerMember.type === "OWNER") return true;
      if (this.serverMember.type === "OWNER") return false;
      return containsPerm(
        this.myRolePermissions,
        permissions.BAN_USER.value | permissions.ADMIN.value
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.main-menu {
  position: absolute;
  background: rgba(34, 34, 34, 0.8);
  box-shadow: 0px 0px 5px 1px rgb(0, 0, 0);
  backdrop-filter: blur(10px);
  user-select: none;
  color: white;
  z-index: 99999;
  top: 0;
  left: 0;
  overflow: hidden;
  border-radius: 4px;
}

.roles-menu {
  background: rgba(34, 34, 34, 0.8);
  box-shadow: 0px 0px 5px 1px rgb(0, 0, 0);
  backdrop-filter: blur(10px);
  user-select: none;
  color: white;
  position: absolute;
  z-index: 99999;
  top: 300px;
  left: 450px;
  max-height: 150px;
  width: 150px;
  overflow: auto;
  border-radius: 4px;
}

::-webkit-scrollbar {
  width: 5px;
}

.item {
  display: flex;
  align-items: center;
  height: 30px;
  padding-left: 10px;
  padding-right: 10px;
  padding: 5px;
  transition: 0.2s;
  font-size: 13px;
  cursor: pointer;
  .material-icons {
    font-size: 20px;
    margin-right: 5px;
    margin-left: -2px;
  }
  .icon-cat {
    margin-right: 5px;
    margin-left: 1px;
    height: 20px;
    width: 20px;
  }
  .has-role {
    margin-left: -2px;
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
