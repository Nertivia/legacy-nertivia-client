<template>
  <div class="drop-background" @click="backgroundClickEvent">
    <div class="box">
      <spinner v-if="!user"/>
      <div class="inner" v-else>
        <div class="top">

            <profile-picture
              class="avatar"
              size="90px"
              emoteSize="28px"
              animationPadding="5px"
              :admin="user.admin"
              :url="`${avatarDomain}${user.avatar}`"
            />

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

          <div class="button" @click="openChat">
            <div class="material-icons">chat</div>Send Message
          </div>
          <div class="button warn">
            <div class="material-icons">block</div>Block
          </div>
        </div>
        <div v-else class="cross"><i class="material-icons">close</i></div>
      </div>
      <div class="about-me-box" v-if="user && user.about_me">
        <div class="title">About {{user.username}}</div>
        <div class="about-me-inner">
          <div class="about-me-detail" v-if="user.about_me.name">
            <div class="about-me-title">
              <div class="main-title-about-me">Name:</div>
              <div class="emoji-about-me"></div>
              {{user.about_me.name}}
            </div>
          </div>

          <div class="about-me-detail" v-if="user.about_me.gender == 0 || user.about_me.gender">
            <div class="about-me-title">
              <div class="main-title-about-me">Gender:</div>
              <div
                class="emoji-about-me"
                v-html="emojiParse(surveyItems.gender[user.about_me.gender].emoji)"
              ></div>
              {{surveyItems.gender[user.about_me.gender].name}}
            </div>
          </div>

          <div class="about-me-detail" v-if="user.about_me.age == 0 || user.about_me.age">
            <div class="about-me-title">
              <div class="main-title-about-me">Age:</div>
              <div
                class="emoji-about-me"
                v-html="emojiParse(surveyItems.age[user.about_me.age].emoji)"
              ></div>
              {{surveyItems.age[user.about_me.age].name}}
            </div>
          </div>

          <div
            class="about-me-detail"
            v-if="user.about_me.continent == 0 || user.about_me.continent"
          >
            <div class="about-me-title">
              <div class="main-title-about-me">Continent:</div>
              <div
                class="emoji-about-me"
                v-html="emojiParse(surveyItems.continents[user.about_me.continent].emoji)"
              ></div>
              {{surveyItems.continents[user.about_me.continent].name}}
            </div>
          </div>

          <div class="about-me-detail" v-if="user.about_me.country == 0 || user.about_me.country">
            <div class="about-me-title">
              <div class="main-title-about-me">Country:</div>
              <div
                class="emoji-about-me"
                v-html="emojiParse(surveyItems.countries[user.about_me.country].emoji)"
              ></div>
              {{surveyItems.countries[user.about_me.country].name}}
            </div>
          </div>

          <div class="about-me-detail" v-if="user.about_me.about_me">
            <div class="about-me-title about_me">
              <div class="main-title-about-me">About Me:</div>
              <div class="emoji-about-me"></div>
              <div class="about-me-format" v-html="formatAboutMe(user.about_me.about_me)"></div>
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
export default {
  components: { Spinner, profilePicture },
  data() {
    return {
      surveyItems: Object.assign({}, surveyItems),
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
      if (!allFriend[userUniqueID]) return null;
      return allFriend[userUniqueID].status;
    }
  }
};
</script>
<style scoped>
.cross {
  margin: auto;
  opacity: 0.1;
}
.cross .material-icons {
  font-size: 150px;
}
.about_me {
  flex-direction: column;
  align-items: initial !important;
  font-size: 15px;
}
.about_me .about-me-format {
  user-select: text;
}
.about-me-box {
  display: flex;
  flex-direction: column;
  background: rgba(31, 31, 31, 0.704);
  width: 300px;
  border-radius: 10px;
  overflow: hidden;
  margin-left: 10px;
  overflow: auto;
  padding-bottom: 10px;
}
.about-me-detail {
  margin-top: 10px;
  margin-left: 20px;
  margin-right: 20px;
}
.about-me-title {
  display: flex;
  align-content: center;
  align-items: center;
}
.about-me-format {
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
}
.emoji-about-me {
  margin-left: 5px;
  margin-right: 10px;
}
.main-title-about-me {
  color: rgb(179, 179, 179);
}

.title {
  padding-top: 10px;
  font-size: 20px;
  text-align: center;
}
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
  width: initial;
  color: white;
  display: flex;
  flex-direction: row;
  user-select: none;
  overflow: hidden;
}
.inner {
  background: rgba(31, 31, 31, 0.904);
  display: flex;
  height: 100%;
  width: 500px;
  flex-direction: column;
  border-radius: 10px;
  overflow: hidden;
}
.top {
  display: flex;
  flex-direction: column;
  background: rgba(22, 22, 22, 0.918);
  width: 100%;
  height: 170px;
  flex-shrink: 0;
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
  height: 100px;
  width: 100px;
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
.avatar{
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
@media (max-width: 815px) {
  .box {
    flex-direction: column;
    max-width: 500px;
    width: 100%;
    overflow: auto;
  }
  .about-me-box {
    width: 100%;
    margin-left: 0;
    margin-top: 10px;
    flex-shrink: 0;
    overflow: initial;
  }
  .inner {
    width: 100%;
    flex-shrink: 0;
    height: initial;
  }
  .bottom {
    flex-shrink: 0;
    height: initial;
    margin-top: 5px;
    margin-bottom: 5px;
  }
  .bottom .button {
    margin: 2px;
    margin-top: 5px;
    margin-bottom: 5px;
    height: 100px;
    -ms-flex-negative: 0;
    flex-shrink: 0;
    -webkit-box-flex: 0;
    -ms-flex: none;
    flex: 1;
    font-size: 10px;
  }
}
</style>