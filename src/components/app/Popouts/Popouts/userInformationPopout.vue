<template>
  <div class="drop-background user-info-popout" @click="backgroundClickEvent">
    <div class="box">
      <div class="back-button" @click="close">
        <div class="material-icons">keyboard_arrow_left</div>
      </div>
      <spinner class="spinner" v-if="!user" />
      <div class="inner" v-if="user">
        <div class="profile">
          <profile-picture
            class="avatar"
            size="120px"
            :avatar="user.avatar"
            :uniqueID="user.uniqueID"
            :hover="true"
          />
          <div class="uesrname-tag">
            <div class="username">{{ user.username }}</div>
            <div class="tag">:{{ user.tag }}</div>
            <div class="bot" v-if="user.bot">Bot</div>
          </div>
          <div class="online-status">
            <div class="status" :style="{ background: status.color }"></div>
            <div>{{ status.name }}</div>
          </div>
          <div class="badges-list">
            <div
              class="badge"
              v-for="(badge, index) of filteredBadges"
              v-bind:style="{ 'border-color': badges[badge].color }"
              :key="index"
            >
              <img class="icon" :src="badges[badge].icon" />
              <div class="name">{{ badges[badge].name }}</div>
            </div>
          </div>

          <div class="actions" v-if="uniqueID !== selfUniqueID">
            <div class="action-buttons">
              <div class="relationship" v-if="!user.bot">
                <div
                  class="button"
                  v-if="this.relationshipStatus === null"
                  @click="AddFriendButton"
                >
                  <div class="material-icons">person_add</div>
                  <div>Add Friend</div>
                </div>
                <div
                  class="button"
                  v-if="this.relationshipStatus === 0"
                  @click="RemoveFriendButton"
                >
                  <div class="material-icons">hourglass_empty</div>
                  <div>Request Sent</div>
                </div>
                <div
                  class="button green"
                  v-if="this.relationshipStatus === 1"
                  @click="AcceptFriendButton"
                >
                  <div class="material-icons">check</div>
                  <div>Accept Friend</div>
                </div>
              </div>
              <div class="button" @click="openChat">
                <div class="material-icons">message</div>
                <div>Message</div>
              </div>
              <div
                class="button warn"
                v-if="this.relationshipStatus === 2"
                @click="RemoveFriendButton"
              >
                <div class="material-icons">person_add_disabled</div>
                <div>Remove Friend</div>
              </div>
              <div
                class="button warn"
                v-if="isBlocked"
                @click="unblockFriendButton"
              >
                <div class="material-icons">block</div>
                <div>Unblock</div>
              </div>
              <div class="button warn" v-else @click="blockFriendButton">
                <div class="material-icons">block</div>
                <div>Block</div>
              </div>
            </div>
          </div>
        </div>
        <div class="scrollable">
          <div class="playing-status" v-if="programActivityStatus && status">
            <div class="title">Activity Status:</div>
            <div class="status program-activity">
              <span class="icon material-icons">widgets</span>
              <strong>{{ programActivityStatus.status }}</strong>
              <span>{{ programActivityStatus.name }}</span>
            </div>
          </div>
          <div v-else-if="customStatus && status" class="playing-status">
            <div class="title">Custom Status:</div>
            <div class="status program-activity">
              <Markup class="custom-status" :text="customStatus" />
            </div>
          </div>

          <div class="about-me">
            <div
              class="about-item-container"
              v-for="aboutItem of aboutMe"
              :key="aboutItem.name"
            >
              <div
                class="about-item"
                v-if="aboutMe"
                :class="{
                  infoAboutMe:
                    aboutItem.key === 'About me' ||
                    aboutItem.key === 'Suspend Reason'
                }"
              >
                <div class="key">{{ aboutItem.key }}:</div>
                <div
                  class="emoji"
                  v-if="aboutItem.emoji"
                  v-html="aboutItem.emoji"
                ></div>
                <Markup
                  class="name"
                  v-if="aboutItem.key === 'About me'"
                  :text="aboutItem.name"
                />
                <div class="name" v-else>{{ aboutItem.name }}</div>
              </div>
            </div>
            <div class="about-item createdBy" v-if="user.bot && user.createdBy">
              <div class="key">{{ this.$t("created-by") }}:</div>
              <div class="name" @click="switchUser(user.createdBy.uniqueID)">
                {{ user.createdBy.username }}
              </div>
            </div>
            <div class="about-item">
              <div class="key">Joined:</div>
              <div class="name">{{ joinedDate }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="second-box" v-if="user">
      <div
        class="second-box-inner roles-box"
        v-if="currentServerID && serverMember"
      >
        <div class="title">Server Roles</div>
        <div class="roles-list" v-if="memberRoles && memberRoles.length">
          <div
            class="role"
            v-for="role in memberRoles"
            :key="role.id"
            :style="{ color: role.color, borderColor: role.color }"
          >
            {{ role.name }}
          </div>
        </div>
        <div v-else class="no-roles">This member has no roles.</div>
      </div>
      <div
        class="second-box-inner common-friends-box"
        v-if="!user || !user.bot"
      >
        <div class="title">Common Friends</div>
        <div class="list">
          <div
            class="item"
            @click="switchUser(user.uniqueID)"
            v-for="user in commonFriendsArr"
            :key="user.uniqueID"
          >
            <profile-picture
              class="avatar"
              size="30px"
              animationPadding="0"
              :uniqueID="user.uniqueID"
              :avatar="user.avatar"
              :hover="true"
            />
            <div class="name">{{ user.username }}</div>
          </div>
        </div>
      </div>
      <div class="second-box-inner common-servers-box">
        <div class="title">Common Servers</div>
        <div class="list">
          <div
            class="item"
            @click="openServer(server.server_id)"
            v-for="server in commonServersArr"
            :key="server.server_id"
          >
            <profile-picture
              class="avatar"
              size="30px"
              animationPadding="0"
              :uniqueID="server.server_id"
              :avatar="server.avatar"
              :hover="true"
            />
            <div class="name">{{ server.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { bus } from "@/main";
import config from "@/config.js";
import statuses from "@/utils/statuses";
import Spinner from "@/components/global/Spinner.vue";
import profilePicture from "@/components/global/ProfilePictureTemplate.vue";
import userService from "@/services/userService.js";
import relationshipService from "@/services/RelationshipService.js";
import surveyItems from "@/utils/surveyItems.js";
import emojiParser from "@/utils/emojiParser.js";
import Markup from "@/components/app/Markup.vue";
import badges from "@/utils/Badges";
import friendlyDate from "@/utils/date";

export default {
  components: { Spinner, profilePicture, Markup },
  data() {
    return {
      surveyItems: Object.assign({}, surveyItems),
      user: null,
      commonServersIDArr: null,
      commonFriendsIDArr: null,
      avatarDomain: config.nertiviaCDN,
      badges,
      isBlocked: null
    };
  },
  methods: {
    close() {
      this.$store.dispatch("setUserInformationPopout", null);
    },
    backgroundClickEvent(event) {
      if (event.target.classList.contains("drop-background")) {
        this.close();
      }
    },
    async AddFriendButton() {
      await relationshipService.post({
        username: this.user.username,
        tag: this.user.tag
      });
    },
    async AcceptFriendButton() {
      await relationshipService.put(this.uniqueID);
    },
    async blockFriendButton() {
      const { ok } = await userService.block(this.uniqueID);
      if (ok) {
        this.isBlocked = true;
      }
    },
    async unblockFriendButton() {
      const { ok } = await userService.unblock(this.uniqueID);
      if (ok) {
        this.isBlocked = false;
      }
    },
    async RemoveFriendButton() {
      await relationshipService.delete(this.uniqueID);
    },
    switchUser(uniqueID) {
      this.$store.dispatch("setUserInformationPopout", uniqueID);
    },
    openChat() {
      this.$store.dispatch("setCurrentTab", 1);
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
    capitalize(s) {
      if (typeof s !== "string") return "";
      return s.charAt(0).toUpperCase() + s.slice(1);
    },
    openServer(serverID) {
      bus.$emit("openServer", serverID);
      this.close();
    }
  },
  async mounted() {
    const { ok, result } = await userService.get(this.uniqueID);
    if (ok) {
      this.user = result.data.user;
      this.isBlocked = result.data.isBlocked;
      this.commonServersIDArr = result.data.commonServersArr;
      this.commonFriendsIDArr = result.data.commonFriendsArr;
    }
  },
  computed: {
    status() {
      let status;
      if (this.uniqueID === this.$store.getters.user.uniqueID) {
        status = this.$store.getters.user.status;
      } else {
        status = this.$store.getters["members/presences"][this.uniqueID];
      }
      return status ? statuses[status] : statuses[0];
    },
    commonFriendsArr() {
      if (!this.commonFriendsIDArr) return;
      const members = Object.values(this.$store.getters["members/members"]);

      const commonFriends = members.filter(m =>
        this.commonFriendsIDArr.includes(m.uniqueID)
      );
      return commonFriends;
    },
    commonServersArr() {
      if (!this.commonServersIDArr) return;
      const commonServers = Object.values(
        this.$store.getters["servers/servers"]
      ).filter(s => this.commonServersIDArr.includes(s.server_id));
      return commonServers;
    },
    currentServerID() {
      if (this.currentTab !== 2) return undefined;
      return this.$store.getters["servers/currentServerID"];
    },
    memberRoles() {
      const serverRoles = this.$store.getters["servers/currentServerRoles"];
      const memberRolesID = this.serverMember.roles;
      if (!serverRoles || !memberRolesID) return;
      return serverRoles.filter(sr => memberRolesID.includes(sr.id));
    },
    serverMember() {
      const serverMembers = this.$store.getters["servers/serverMembers"];
      return serverMembers.find(
        m =>
          m.uniqueID === this.uniqueID && m.server_id === this.currentServerID
      );
    },
    currentTab() {
      return this.$store.getters.currentTab;
    },
    joinedDate() {
      return friendlyDate(this.user.created);
    },
    aboutMe() {
      const about_me = this.user.about_me;
      if (!about_me) return null;
      if (about_me._id) delete about_me._id;
      const arr = [];
      for (let index in about_me) {
        const item = {
          key: this.capitalize(index.replace("_", " ")),
          name: about_me[index]
        };
        if (item.name && item.name.length && item.name !== "Rather not say") {
          if (surveyItems.constants[index]) {
            const i = surveyItems[surveyItems.constants[index]].find(
              i => i.name === item.name
            );
            item.emoji = i ? this.emojiParse(i.emoji) : undefined;
          }
          arr.push(item);
        }
      }
      // remove fields that have custom names ( example: country: lol)
      return arr.filter(a => {
        if (a.key.toLowerCase() === "constants") {
          return;
        }
        const fieldName = this.surveyItems.constants[a.key.toLowerCase()];
        if (
          fieldName &&
          !this.surveyItems[fieldName].find(f => f.name === a.name)
        ) {
          return false;
        } else {
          return true;
        }
      });
    },
    filteredBadges() {
      if (!this.user.badges) return;
      return this.user.badges.filter(b => this.badges[b]);
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
    },
    customStatus() {
      if (this.user.uniqueID === this.$store.getters.user.uniqueID) {
        return this.$store.getters.user.custom_status;
      }
      const customStatusArr = this.$store.getters["members/customStatusArr"];
      return customStatusArr[this.user.uniqueID];
    },
    programActivityStatus() {
      const programActivityJson = this.$store.getters[
        "members/programActivity"
      ];
      return programActivityJson[this.user.uniqueID];
    }
  }
};
</script>
<style scoped lang="scss">
@import "@/styles/global";
.playing-status {
  width: 100%;
  background: $primary-button-color;
  .title {
    margin-top: 4px;
    font-size: 15px;
    opacity: 0.8;
  }

  .status {
    font-size: 14px;
    line-break: anywhere;
    display: block;
    margin-left: 10px;
    margin-bottom: 5px;
  }
  strong {
    margin-right: 5px;
  }

  .material-icons {
    font-size: 16px;
    margin-right: 5px;
  }
}

.second-box {
  display: flex;
  flex-direction: column;
  height: 550px;
  margin-left: 40px;
}
.second-box .second-box-inner {
  display: flex;
  flex-direction: column;
  flex: 1;
  color: white;
  background: $other-box-color;
  width: 250px;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  overflow: hidden;
  .title {
    margin: 5px;
  }
  box-shadow: 0px 0px 20px 5px #151515bd;
}

.second-box .second-box-inner {
  margin-top: 10px;
  margin-bottom: 10px;
}

.second-box .second-box-inner:first-child {
  margin-top: 0;
}
.second-box .second-box-inner:last-child {
  margin-bottom: 0;
}

.roles-list {
  display: block;
  overflow: auto;
  margin-left: 5px;
}
.role {
  display: inline-block;
  padding: 3px;
  border: solid 1px;
  border-radius: 4px;
  margin: 3px;
}
.no-roles {
  color: rgba(255, 255, 255, 0.8);
  margin-left: 5px;
}
.list {
  display: flex;
  flex-direction: column;
  overflow: auto;
}
.online-status {
  display: flex;
  flex-shrink: 0;
  align-content: center;
  align-items: center;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  .status {
    background: gray;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    align-self: center;
    flex-shrink: 0;
    margin-right: 5px;
  }
}
.item {
  display: flex;
  align-content: center;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;
  padding: 3px;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.8);
  .avatar {
    margin-right: 5px;
    margin-left: 5px;
    height: 30px;
    width: 30px;
    object-fit: cover;
    border-radius: 50%;
  }
  .name {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
}

.drop-background {
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999999;
  display: flex;
  justify-content: center;
  align-items: center;
}
.box {
  height: 550px;
  width: 350px;
  color: white;
  display: flex;
  flex-direction: row;
  position: relative;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: $other-box-color;
  border-radius: 4px;
  backdrop-filter: blur(5px);
  overflow: hidden;
}

.spinner {
  align-self: center;
}

.inner {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  overflow: auto;
}
.scrollable {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  overflow: auto;
  scrollbar-width: thin;
}
.scrollable::-webkit-scrollbar {
  width: 3px;
}
.profile {
  display: flex;
  flex-direction: column;
  align-content: center;
  width: 100%;
  align-items: center;
  align-content: center;
  padding-bottom: 10px;
  flex-shrink: 0;
  background: $box-secondary-color;
  padding-top: 30px;
  box-shadow: 0px 0px 5px 0px black;
}

.createdBy .name {
  user-select: none;
  cursor: pointer;
  &:hover {
    color: white;
    text-decoration: underline;
  }
}

.bot {
  background: #a31aff;
  padding: 2px;
  border-radius: 2px;
  font-size: 12px;
  margin-left: 5px;
  flex-shrink: 0;
  align-self: center;
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
  color: rgba(255, 255, 255, 0.7);
}

.button {
  padding: 8px;
  align-self: center;
  user-select: none;
  cursor: default;
  transition: 0.3s;
  position: relative;
  z-index: 1;
  cursor: pointer;
}
.button::after {
  content: "";
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  border-radius: 4px;
  background: rgb(51, 163, 255);
  z-index: -1;
  opacity: 0.8;
  transition: 0.3s;
}
.button.green::after {
  background: rgb(0, 200, 84);
}
.button:hover::after {
  opacity: 1;
}

.actions {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;

  user-select: none;
  cursor: default;
  flex-shrink: 0;
}
.title {
  font-size: 16px;
  margin-bottom: 3px;
  margin-left: 10px;
}
.badges-list {
  display: flex;
  flex-wrap: wrap;
  flex-shrink: 0;
  margin-left: 8px;
  margin-top: 5px;
  align-content: center;
  align-items: center;
  justify-content: center;
}
.badge {
  border: solid 1px white;
  padding: 5px;
  padding-left: 5px;
  padding-right: 6px;
  padding-right: 0.25rem;
  border-radius: 6px;
  margin: 3px;
  display: flex;
  flex-shrink: 0;
  align-self: center;
  font-size: 12px;
}
.badge .name {
  margin-top: 1px;
}

.badge div {
  align-self: center;
  margin-left: 5px;
}
.badge img {
  align-self: center;
  height: 15px;
  width: 15px;
}

.about-me {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin-top: 10px;
  cursor: default;
  flex-shrink: 0;
}
.about-item {
  display: flex;
  align-items: center;
  margin-top: 2px;
  margin-bottom: 2px;
  padding: 10px;
  padding-top: 5px;
  padding-bottom: 5px;
  flex-shrink: 0;
}
.about-item .key {
  color: rgba(255, 255, 255, 0.7);
}
.about-item .name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: rgba(255, 255, 255, 0.9);
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
}

.back-button {
  display: flex;
  position: absolute;
  left: 20px;
  top: 20px;
  cursor: pointer;
  height: 30px;
  width: 30px;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  align-content: center;
  transition: 0.2s;
  user-select: none;
  opacity: 0.7;
}
.back-button:hover {
  opacity: 1;
}
@media (max-width: 432px) {
  .box {
    width: 100%;
    height: 100%;
    max-height: initial;
    border-radius: 0;
  }
}
@media (max-width: 550px) {
  .second-box {
    display: none;
  }
}
</style>
<style>
.emoji img {
  height: 20px;
  width: 20px;
}
.custom-status .emoji {
  height: 18px;
  width: 18px;
  vertical-align: -3px;
}
</style>
