<template>
  <div
    class="member"
    @click="openUserInformation()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    @contextmenu.prevent="rightClickEvent"
  >
    <Profile-picture
      class="avatar"
      :avatar="this.avatar"
      :hover="hover"
      size="30px"
      :uniqueID="user.uniqueID"
      :status="presense"
    />
    <div class="information">
      <div class="username" :style="{ color: roleColor }">
        {{ user.username }}
      </div>
      <div v-if="programActivityStatus && presense" class="custom-status program" :title="`${programActivityStatus.status} ${programActivityStatus.name}`">
        <span class="icon material-icons">widgets</span>
        <strong>{{programActivityStatus.status}}</strong>
        <span>{{programActivityStatus.name}}</span>
      </div>
      <Markup
        :title="customStatus"
        v-else-if="customStatus && presense"
        class="custom-status"
        :text="customStatus"
      />
    </div>
    <div v-if="type === 'OWNER'" class="type-box">Owner</div>
    <div v-else-if="isBot" class="type-box bot">Bot</div>
    <div v-else-if="isAdmin" class="type-box admin">Admin</div>
  </div>
</template>

<script>
import Markup from "@/components/app/Markup.vue";
import ProfilePicture from "@/components/global/ProfilePictureTemplate";
import { containsPerm, permissions } from "../../utils/RolePermissions";
export default {
  components: { ProfilePicture, Markup },
  props: ["user", "avatar", "type", "member"],
  data() {
    return {
      hover: false,
    };
  },
  computed: {
    isBot() {
      return this.member.type === "BOT"
    },
    serverID() {
      return this.$store.getters["servers/currentServerID"];
    },
    presense() {
      //attach presense
      if (this.user.uniqueID === this.$store.getters.user.uniqueID) {
        return this.$store.getters.user.status || 0;
      }
      const presences = this.$store.getters["members/presences"];
      const userPresense = presences[this.user.uniqueID];
      return userPresense || 0;
    },
    customStatus() {
      if (this.user.uniqueID === this.$store.getters.user.uniqueID) {
        return this.$store.getters.user.custom_status;
      }
      const customStatusArr = this.$store.getters["members/customStatusArr"];
      return customStatusArr[this.user.uniqueID];
    },
    programActivityStatus() {
      const programActivityJson = this.$store.getters["members/programActivity"];
      return programActivityJson[this.user.uniqueID]
    },
    roles() {
      return this.$store.getters["servers/currentServerRoles"];
    },
    roleColor() {
      if (!this.member || !this.member.roles) return undefined;
      if (!this.roles) return undefined;

      let filter = this.roles.filter((r) => this.member.roles.includes(r.id));

      if (filter.length) {
        if (filter[0].color) {
          return filter[0].color + " !important";
        } else {
          return undefined;
        }
      } else {
        return this.roles.find((r) => r.default).color + " !important";
      }
    },
    isAdmin() {
      if (!this.roles) return false;
      const defaultRole = this.roles.find((r) => r.default === true);
      if (containsPerm(defaultRole.permissions, permissions.ADMIN.value)) {
        return true;
      }
      if (!this.member.roles) {
        return false;
      }

      for (let index = 0; index < this.member.roles.length; index++) {
        const roleID = this.member.roles[index];
        const role = this.roles.find((r) => r.id === roleID);
        if (role) {
          if (containsPerm(role.permissions, permissions.ADMIN.value)) {
            return true;
          }
        }
      }

      return false;
    },
  },
  methods: {
    openUserInformation() {
      this.$store.dispatch("setUserInformationPopout", this.user.uniqueID);
    },
    rightClickEvent(event) {
      const x = event.clientX;
      const y = event.clientY;
      this.$store.dispatch("setServerMemberContext", {
        serverID: this.serverID,
        uniqueID: this.user.uniqueID,
        x,
        y,
      });
    },
  },
};
</script>

<style scoped>
.member {
  display: flex;
  align-items: center;
  align-content: center;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  border-radius: 4px;
  margin-left: 5px;
  margin-right: 5px;
  padding-left: 5px;
}

.member:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.information {
  margin-left: 5px;
  overflow: hidden;
  flex: 1;
}
.username {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.type-box {
  padding: 4px;
  border-radius: 2px;
  font-size: 12px;
  margin-right: 10px;
  background: rgb(255, 71, 71);
}

.type-box.admin {
  background: #ff6947;
}
.type-box.bot {
  background: #a31aff;
}
.custom-status {
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
  align-items: center;
  align-content: center;
  white-space: pre;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 18px;

}
.custom-status.program strong {
  margin-right: 3px;
}
.custom-status.program .icon {
  font-size: 14px;
  vertical-align: -2px;
  color: white;
  margin-right: 3px;
}
</style>

<style>
.custom-status .emoji {
  height: 14px;
  width: 14px;
  vertical-align: -3px;
}
</style>