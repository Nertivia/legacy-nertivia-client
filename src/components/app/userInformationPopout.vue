<template>
  <div class="drop-background" @click="backgroundClickEvent">
    <div class="box">
      <spinner v-if="!user"/>
      <div class="inner" v-else>
        <div class="top">
          <div class="profile-picture-outer">
            <profile-picture
              size="90px"
              emoteSize="28px"
              animationPadding="5px"
              :admin="user.admin"
              :url="`${avatarDomain}${user.avatar}`"
            />
          </div>
          <div class="info">
            <div class="username">{{user.username}}</div>
            <div class="tag">@{{user.tag}}</div>
          </div>
        </div>
        <div class="bottom" v-if="selfUniqueID !== user.uniqueID">

          <div class="button valid" v-if="this.relationshipStatus == null" @click="AddFriendButton">
            <div class="material-icons">person_add</div>Add friend
          </div>

          <div class="button valid" v-if="this.relationshipStatus == 0" @click="RemoveFriendButton">
            <div class="material-icons">person_add</div>Request Sent!
          </div>

          <div class="button valid" v-if="this.relationshipStatus == 1" @click="AcceptFriendButton">
            <div class="material-icons">person_add</div>Accept Friend
          </div>

          <div class="button warn" v-if="this.relationshipStatus == 2" @click="RemoveFriendButton">
            <div class="material-icons">person_add_disabled</div>End Friendship
          </div>

          <div class="button">
            <div class="material-icons">chat</div>Send Message
          </div>
          <div class="button warn">
            <div class="material-icons">block</div>Block
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

import config from "@/config.js";
import Spinner from "@/components/Spinner.vue";
import profilePicture from "@/components/ProfilePictureTemplate.vue";
import userService from "@/services/userService.js";
import relationshipService from "@/services/RelationshipService.js";
export default {
  components: { Spinner, profilePicture },
  data() {
    return {
      user: null,
      avatarDomain: config.domain + "/avatars/"
    };
  },
  methods: {
    backgroundClickEvent(event) {
      if (event.target.classList.contains("drop-background")) {
        this.$store.dispatch("setUserInformationPopout", null);
      }
    },
    async AddFriendButton() {
      const {ok, error, result} = await relationshipService.post({username: this.user.username, tag: this.user.tag});
    },
    async AcceptFriendButton() {
      const {ok, error, result} = await relationshipService.put(this.uniqueID);
    },
    async RemoveFriendButton() {
      const {ok, error, result} = await relationshipService.delete(this.uniqueID);
    }
  },
  async mounted() {
    const { ok, error, result } = await userService.get(this.uniqueID);
    if (ok) {
      this.user = result.data.user;
    }
  },
  computed: {
    selfUniqueID() {
      return this.$store.getters.user.uniqueID;
    },
    uniqueID() {
      return this.$store.getters.popouts.userInformationPopoutID;
    },
    relationshipStatus() {
      const userUniqueID = this.$store.getters.popouts.userInformationPopoutID;
      const allFriend = this.$store.getters.user.friends;
      if (!allFriend[userUniqueID]) return null
      return allFriend[userUniqueID].status
    }
  }
};
</script>
<style scoped>
.drop-background {
  position: absolute;
  background: rgba(0, 0, 0, 0.521);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
}
.box {
  margin: auto;
  height: 330px;
  width: 500px;
  background: rgba(31, 31, 31, 0.904);
  border-radius: 5px;
  color: white;
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
}
.inner {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
}
.top {
  display: flex;
  flex-direction: column;
  background: rgba(22, 22, 22, 0.918);
  width: 100%;
  height: 170px;
}
.bottom {
  display: flex;
  height: 100%;
  width: calc(100% - 20px);
  margin: auto;
}
.button {
  background: rgba(49, 49, 49, 0.815);
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  flex: 1;
  margin: 30px;
  margin-left: 20px;
  margin-right: 20px;
  transition: 0.3s;
}
.button .material-icons {
  margin-bottom: 10px;
  font-size: 40px;
}

.button:hover {
  background: rgb(61, 61, 61);
}

.button.valid {
  background: #09ff002d;
}
.button.valid:hover {
  background: #09ff00ab;
}

.button.warn {
  background: #ff00002d;
}
.button.warn:hover {
  background: #ff0000ab;
}

.profile-picture-outer {
  display: flex;
  z-index: 9999;
  margin: auto;
  margin-bottom: 0px;
}
.info {
  margin-top: 1px;
  margin: auto;
  font-size: 20px;
  display: flex;
  user-select: text;
}
.tag {
  color: grey;
}
</style>