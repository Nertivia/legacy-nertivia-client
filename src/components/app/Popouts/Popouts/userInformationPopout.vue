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
            <div class="tag">@{{user.tag}}</div>
          </div>  
            <div class="actions" v-if="uniqueID !== selfUniqueID">
              <div class="action-buttons">
                <div class="button" v-if="this.relationshipStatus === null" @click="AddFriendButton"><div class="material-icons">person_add</div><div>Add Friend</div></div>  
                <div class="button" v-if="this.relationshipStatus === 0" @click="RemoveFriendButton"><div class="material-icons">hourglass_empty</div><div>Request Sent</div></div>  
                <div class="button green" v-if="this.relationshipStatus === 1" @click="AcceptFriendButton"><div class="material-icons">check</div><div>Accept Friend</div></div>
                <div class="button" @click="openChat"><div class="material-icons">message</div><div>Message</div></div>  
                <div class="button warn" v-if="this.relationshipStatus === 2" @click="RemoveFriendButton"><div class="material-icons">person_add_disabled</div><div>Remove Friend</div></div>
                <div class="button warn"><div class="material-icons">block</div><div>Block</div></div>
              </div>
          </div>
        </div>
        <div class="scrollable">
          <div class="badges" v-if="user.badges && filteredBadges.length">
            <div class="title">Badges</div>
            <div class="badges-list">
              <div class="badge" v-for="(badge, index) of filteredBadges" v-bind:style="{ 'border-color': badges[badge].color }" :key="index">
                <img class="icon" :src="badges[badge].icon"/>
                <div class="name">{{badges[badge].name}}</div>
              </div>
            </div>
          </div>
          <div class="about-me" v-if="aboutMe">
            <div class="title">About Me</div>
            <div class="about-item" v-for="(aboutItem) of aboutMe" :key="aboutItem.name" :class="{infoAboutMe: aboutItem.key === 'About me'}">
              <div class="key">{{aboutItem.key}}: </div>
              <div class="emoji" v-if="aboutItem.emoji" v-html="aboutItem.emoji"></div>
              <div class="name" v-if="aboutItem.key === 'About me'" v-html="formatAboutMe(aboutItem.name)"></div>
              <div class="name" v-else>{{aboutItem.name}}</div>
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
    },
    capitalize(s){
      if (typeof s !== 'string') return ''
      return s.charAt(0).toUpperCase() + s.slice(1)
    }
  },
  async mounted() {
    const { ok, error, result } = await userService.get(this.uniqueID);
    if (ok) {
      this.user = result.data.user;
    }
  },
  computed: {
    aboutMe(){
      const about_me = this.user.about_me
      if (!about_me) return null;
      if (about_me._id) delete about_me._id;
      const arr = [];
      for (let index in about_me) {
        const item = {key: this.capitalize(index.replace('_', " ")), name: about_me[index]};
        if (item.name && item.name.length && item.name !== "Rather not say"){
          if (surveyItems.constants[index]){
            const i = surveyItems[surveyItems.constants[index]].find(i => i.name === item.name);
            item.emoji = i ? this.emojiParse(i.emoji) : undefined; 
          }
          arr.push(item)
        }
      }
      return arr
    },
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
  justify-content: center;
  align-items: center;
}
.box {
  max-height: 500px;
  width: 350px;
  color: white;
  display: flex;
  flex-direction: row;
  background: rgba(22, 22, 22, 0.853);
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
  overflow: auto;
}
.scrollable {
  margin-top: 5px;
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  overflow: auto;
}
.scrollable::-webkit-scrollbar {
    width: 3px;
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
  flex-shrink: 0;
  background: rgba(41, 41, 41, 0.697);
  padding-top: 30px;
  border-radius: 5px;
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
  padding: 8px; 
  align-self: center;
  border-radius: 5px;
  user-select: none;
  cursor: default;
  transition: 0.3s;
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.button::after{
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgb(51, 163, 255);
  z-index: -1;
  border-radius: 5px;
  opacity: 0.8;
  transition: 0.3s;
}
.button.green::after {
  background: rgb(0, 200, 84);
}
.button:hover::after {
  opacity: 1;
}

.badges{
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 3px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.733);
  padding-bottom: 10px;
  user-select: none;
  cursor: default;
  flex-shrink: 0
}
.actions {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;

  user-select: none;
  cursor: default;
  flex-shrink: 0
}
.title {
  font-size: 20px;
  margin-bottom: 3px;
}
.badges-list{
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0
}
.badge {
  border: solid 1px white;
  padding: 5px;
  border-radius: 5px;
  margin: 3px;
  display: flex;
  flex-shrink: 0
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

.about-me{
   display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
  margin-bottom: 5px;
  border-bottom: solid 1px rgba(255, 255, 255, 0.733);
  padding-bottom: 10px;
  cursor: default;
  flex-shrink: 0
}
.about-item{
  display: flex;
  align-items: center;
  background: rgba(47, 47, 47, 0.37);
  margin: 2px;
  border-radius: 5px;
  padding: 10px;
  flex-shrink: 0

}
.about-item .key {
  color: rgb(0, 153, 255);
}
.about-item .name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.about-item div {
  align-self: center;
  margin-right: 5px;
}
.infoAboutMe {
  height: initial;
  flex-direction: column;
}
.infoAboutMe .key {
  align-self: flex-start;
  margin-bottom: 5px;
}
.infoAboutMe .name {
  align-self: center;
  width: 100%;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  text-overflow: none;
  margin-right: 0;
}

.action-buttons {
  display: flex;
  align-self: center;
}
.action-buttons .button {
  font-size: 12px;
  text-align: center;
  margin: 2px;
  display: flex;
  flex-direction: row;
}

.action-buttons .button .material-icons {
  margin-right: 5px;
  font-size: 18px;
}
.action-buttons .button div {
  align-self: center;
}
.action-buttons .button.warn::after {
  background: rgb(255, 53, 53);
  border-radius: 5px;
}
@media (max-width: 352px) {
  .box {
    width: 100%;
  }
}
</style>
<style>
  .emoji img {
    height: 20px;
    width: 20px; 
  }
</style>
