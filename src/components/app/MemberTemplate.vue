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
      :url="`${userAvatar}${hover ? '' : '?type=png'}`"
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
  </div>
</template>

<script>
import ProfilePicture from "@/components/ProfilePictureTemplate";
import config from "@/config";
export default {
  components: { ProfilePicture },
  props: ["user", "avatar", "type", "member"],
  data() {
    return {
      hover: false
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
    roleColor() {
      if (!this.member || !this.member.roles) return undefined;
      const roles = this.$store.getters["servers/selectedServerRoles"];
      if (!roles) return undefined;

      const filter = roles.filter(r => this.member.roles.includes(r.id));
      if (!filter.length) {
        return null;
      }
      return filter[0].color;
    }
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

.avatar {
}
</style>
