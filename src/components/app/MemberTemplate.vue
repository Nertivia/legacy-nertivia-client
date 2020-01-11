<template>
  <div
    class="member"
    @click="openUserInformation()"
    @mouseover="mouseOverEvent"
    @mouseleave="hover = false"
    @contextmenu.prevent="rightClickEvent"
  >
    <Profile-picture
      class="avatar"
      :url="`${userAvatar}${hover || !isGif ? '' : '?type=webp'}`"
      size="30px"
      :unique-i-d="user.uniqueID"
      :status="presense"
    />
    <div class="information">
      <div class="username" :style="{ color: roleColor }">
        {{ user.username }}
      </div>
    </div>
    <div v-if="type === 'OWNER'" class="type-box">Owner</div>
    <div v-else-if="isAdmin" class="type-box admin">Admin</div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/ProfilePictureTemplate";
import config from "@/config";
import { containsPerm, permissions } from "../../utils/RolePermissions";
export default {
  components: { ProfilePicture },
  props: ["user", "avatar", "type", "member"],
  data() {
    return {
      hover: false,
      isGif: false,
    };
  },
  computed: {
    serverID() {
      return this.$store.getters["servers/selectedServerID"];
    },
    userAvatar() {
      return config.domain + "/avatars/" + this.avatar;
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
    roles() {
      return this.$store.getters["servers/selectedServerRoles"];
    },
    roleColor() {
      if (!this.member || !this.member.roles) return undefined;
      if (!this.roles) return undefined;

      let filter = this.roles.filter(r => this.member.roles.includes(r.id));
      if (!filter.length) {
        filter = [this.roles.find(r => r.default)];
      }
      return filter[0].color + " !important";
    },
    isAdmin() {
      if (!this.roles) return false;
      const defaultRole = this.roles.find(r => r.default === true);
      if (containsPerm(defaultRole.permissions, permissions.ADMIN.value)) {
        return true;
      }
      if (!this.member.roles) {
        return false;
      }

      for (let index = 0; index < this.member.roles.length; index++) {
        const roleID = this.member.roles[index];
        const role = this.roles.find(r => r.id === roleID);
        if (role) {
          if (containsPerm(role.permissions, permissions.ADMIN.value)) {
            return true;
          }
        }
      }

      return false;
    }
  },
  mounted() {
    this.isGif = this.userAvatar.endsWith(".gif");
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
        y
      });
    },
    mouseOverEvent() {
      if (this.isGif) {
        this.hover = true;
      }
    }
  }
};
</script>

<style scoped>
.member {
  display: flex;
  padding: 3px;
  align-items: center;
  align-content: center;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  overflow: hidden;
  border-radius: 4px;
  margin-left: 5px;
  margin-right: 5px;
}

.member:hover {
  background: #063442;
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
  padding: 3px;
  border-radius: 5px;
  height: 100%;
  background: rgb(255, 71, 71);
}

.type-box.admin {
  background: #ff6947;
}
.avatar {
}
</style>
