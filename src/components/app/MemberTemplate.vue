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
      <div class="username">{{ user.username }}</div>
    </div>
    <div v-if="type === 'OWNER'" class="type-box">Owner</div>
  </div>
</template>


<script>
import ProfilePicture from "@/components/ProfilePictureTemplate";
import config from "@/config";
export default {
  components: { ProfilePicture },
  props: ["user", "avatar", "type"],
  data() {
    return {
      hover: false
    };
  },
  computed: {
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
        serverID: this.$store.getters["servers/selectedServerID"],
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
}

.member:hover {
  background: #064d55;
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
