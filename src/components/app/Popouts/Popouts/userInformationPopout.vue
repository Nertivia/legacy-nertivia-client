<template>
  <div
    class="drop-background"
    @click="backgroundClickEvent"
  >
    <div class="box">
      <spinner class="spinner" v-if="!user" />
      <div class="inner" v-if="user">
        <div class="profile">
          <profile-picture
            class="avatar"
            size="120px"
            :url="`${avatarDomain}${user.avatar}`"
          />
          <div class="uesrname-tag">
            <div class="username">{{user.username}}</div>
            <div class="tag">#{{user.tag}}</div>
          </div>
          <div class="button" v-if="uniqueID !== selfUniqueID">Add Friend</div>     
        </div>
        <div class="badges" v-if="user.badges && filteredBadges.length">
          <div class="title">Badges</div>
          <div class="badges-list">
            <div class="badge" v-for="(badge, index) of filteredBadges" v-bind:style="{ 'border-color': badges[badge].color }" :key="index">
              <img class="icon" :src="badges[badge].icon"/>
              <div class="name">{{badges[badge].name}}</div>
            </div>
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
import surveyItems from "@/utils/surveyItems.js";
import emojiParser from "@/utils/emojiParser.js";
import messageFormatter from "@/utils/messageFormatter.js";
import badges from "@/utils/Badges";

export default {
  components: { Spinner, profilePicture },
  data() {
    return {
      surveyItems: Object.assign({}, surveyItems),
      user: null,
      avatarDomain: config.domain + "/avatars/",
      badges
    };
  },
  computed: {
    filteredBadges() {
      if (!this.user.badges) return;
      return this.user.badges.filter(b => this.badges[b])
    },
    selfUniqueID() {
      return this.$store.getters.user.uniqueID;
    },
    uniqueID() {
      return this.$store.getters.popouts.userInformationPopoutID;
    },
    relationshipStatus() {
      const userUniqueID = this.$store.getters.popouts.userInformationPopoutID;
      const allFriend = this.$store.getters.user.friends;
      if (!allFriend[userUniqueID]) return null;
      return allFriend[userUniqueID].status;
    }
  },
  async mounted() {
    const { ok, error, result } = await userService.get(this.uniqueID);
    if (ok) {
      this.user = result.data.user;
    }
  },
  methods: {
    backgroundClickEvent(event) {
      if (event.target.classList.contains("drop-background")) {
        this.$store.dispatch("setUserInformationPopout", null);
      }
    },
    async AddFriendButton() {
      const { ok, error, result } = await relationshipService.post({
        username: this.user.username,
        tag: this.user.tag
      });
    },
    async AcceptFriendButton() {
      const { ok, error, result } = await relationshipService.put(
        this.uniqueID
      );
    },
    async RemoveFriendButton() {
      const { ok, error, result } = await relationshipService.delete(
        this.uniqueID
      );
    },
    openChat() {
      this.$store.dispatch("openChat", {
        uniqueID: this.uniqueID,
        channelName: this.user.username
      });
      this.$store.dispatch("setUserInformationPopout", null);
    },
    emojiParse(emoji) {
      if (emoji.startsWith("<img")) return emoji;
      return emojiParser.replaceEmojis(emoji);
    },
    formatAboutMe(string) {
      return messageFormatter(string);
    }
  },
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
  max-height: 500px;
  width: 350px;
  color: white;
  display: flex;
  flex-direction: row;
  overflow: auto;
  background: rgba(0, 0, 0, 0.553);
  border-radius: 10px;

}
.spinner {
  align-self: center;
}

.inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: 10px;
  padding-top: 30px;
}
.profile {
  display: flex;
  flex-direction: column;
  align-content: center;
  border-bottom: solid 1px rgba(255, 255, 255, 0.733);
  width: 100%;
  align-items: center;
  align-content: center;
  padding-bottom: 10px;
}

.uesrname-tag {
  display: flex;
  font-size: 20px;
  text-align: center;
  align-self: center;
  margin-top: 10px;
  margin-bottom: 10px;
  user-select: auto !important;
}
.tag {
  color: rgb(139, 139, 139);
}

.button {
  background: rgb(23, 151, 255);
  padding: 8px;
  align-self: center;
  border-radius: 5px;
  user-select: none;
  cursor: default;
}
.badges{
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.733);
  padding-bottom: 10px;
  user-select: none;
  cursor: default;
}
.badges .title {
  font-size: 20px;
}
.badges-list{
  display: flex;
  margin-top: 5px;
  flex-wrap: wrap;
}
.badge {
  border: solid 1px white;
  padding: 5px;
  border-radius: 5px;
  margin: 3px;
  display: flex;
}

.badge div {
  align-self: center;
  margin-left: 5px;
}
.badge img {
  align-self: center;
  height: 20px;
  width: 20px;
}

@media (max-width: 815px) {
  
}
</style>