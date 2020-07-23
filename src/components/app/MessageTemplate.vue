<template>
  <div
    class="message-container container"
    :class="{ 'mentioned-message': isMentioned, hideAdditional }"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      class="new-badge"
      v-if="notificationLastMessageID && notificationLastMessageID === message.messageID"
    >{{$t('new-messages')}}</div>
    <div
      v-if="!message.type || message.type === 0"
      :class="{
        message: true,
        ownMessage: user.uniqueID === creator.uniqueID,
        ownMessageRight:
          user.uniqueID === creator.uniqueID &&
          apperance &&
          apperance.own_message_right === true,
      }"
    >
      <div class="small-time" v-if="hideAdditional" :title="getDate">{{ getTime }}</div>
      <div class="avatar" v-if="!hideAdditional">
        <profile-picture
          :admin="creator.admin"
          :hover="hover"
          :avatar="creator.avatar"
          :uniqueID="creator.uniqueID"
          size="50px"
          @click.native="openUserInformation"
          @contextmenu.native.prevent="openMemberContext"
        />
      </div>
      <div class="triangle">
        <div class="triangle-inner" v-if="!hideAdditional" />
      </div>
      <div class="all-content">
        <div class="content-outer">
          <div class="content" @dblclick="contentDoubleClickEvent">
            <div class="user-info">
              <div
                v-if="!hideAdditional"
                class="username"
                :style="{ color: loaded ? roleColor : null }"
                @click="openUserInformation"
                @contextmenu.prevent="openMemberContext"
              >{{ creator.username }}</div>
              <div class="bot" v-if="!hideAdditional && creator.bot">Bot</div>
              <div class="date" v-if="!hideAdditional">{{ getDate }}</div>
              <div
                class="mentioned material-icons"
                v-if="isMentioned"
                title="You were mentioned"
              >alternate_email</div>
            </div>
            <div class="inner-content">
              <Markup
                @contextmenu.native="openContextMenu($event, true)"
                class="content-message"
                :style="[
                message.color && message.color !== -2
                  ? { color: message.color }
                  : '',
              ]"
                :text="message.message"
                :message="message"
              />

              <FileMessage v-if="getFile && !getFile.fileName.endsWith('.mp3')" :file="getFile" />
              <MusicMessage
                v-else-if="getFile && getFile.fileName.endsWith('.mp3')"
                :file="getFile"
              />

              <InviteMessage
                :key="message.timeEdited || message.tempID"
                v-else-if="inviteEmbed"
                :invite="inviteEmbed"
              />

              <ThemeMessage
                :key="message.timeEdited || message.tempID"
                v-else-if="themeEmbed"
                :theme="themeEmbed"
              />

              <message-embed-template
                v-else-if="message.embed && Object.keys(message.embed).length"
                :embed="message.embed"
              />
              <message-html-embeds v-if="message.htmlEmbed" :embed="message.htmlEmbed" />

              <div
                class="image-content"
                ref="image"
                v-if="getImage"
                @contextmenu="imageContextEvent"
              >
                <img :src="getImage" @click="imageClicked" />
              </div>
            </div>
          </div>
          <div class="other-information">
            <div class="drop-down-button" ref="drop-down-button" @click="openContextMenu">
              <i class="material-icons">more_vert</i>
            </div>
            <div
              class="sending-status"
              v-if="message.timeEdited &&(message.status === undefined || message.status === 1)"
              :title="`Edited ${getEditedDate}`"
              >
              <i class="material-icons">edit</i>
            </div>
            <div class="sending-status" v-else-if="message.status === 0">
              <i class="material-icons">hourglass_full</i>
            </div>
            <div class="sending-status" v-else-if="message.status === 1">
              <i class="material-icons">done</i>
            </div>
            <div class="sending-status" v-else-if="message.status === 2">
              <i class="material-icons">close</i> Failed
            </div>
          </div>
        </div>
        <bot-buttons v-if="message.buttons && message.buttons.length" :message="message" />
      </div>
    </div>
    <PresenceMessage
      v-if="message.type > 0 && message.type < 5"
      :type="message.type"
      :creator="creator"
      :date="getDate"
      @openContext="openContextMenu"
      @openUserInformation="openUserInformation"
      @openMemberContext="openMemberContext"
    />
  </div>
</template>

<script>
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import PresenceMessage from "./PresenceMessage.vue";
import BotButtons from "./BotButtons.vue";
import FileMessage from "./FileMessage.vue";
import InviteMessage from "./InviteMessage.vue";
import ThemeMessage from "./ThemeMessage.vue";
import MusicMessage from "./MusicMessage.vue";
import Markup from "./Markup.vue";
import messageEmbedTemplate from "./messageEmbedTemplate";

const MessageHtmlEmbeds = () => import("./MessageHtmlEmbeds");

import config from "@/config.js";
import friendlyDate, { time } from "@/utils/date";
import path from "path";
import windowProperties from "@/utils/windowProperties";
import { mapState } from "vuex";
import isElectron from "../../utils/ElectronJS/isElectron";
export default {
  props: [
    "creator",
    "message",
    "isServer",
    "hideAdditional",
    "notificationLastMessageID"
  ],
  components: {
    ProfilePicture,
    messageEmbedTemplate,
    Markup,
    PresenceMessage,
    FileMessage,
    MusicMessage,
    InviteMessage,
    ThemeMessage,
    BotButtons,
    MessageHtmlEmbeds
  },
  data() {
    return {
      hover: false,
      loaded: false
    };
  },
  methods: {
    openMemberContext(event) {
      if (!this.isServer) return;
      if (!this.serverMember) return;
      const x = event.clientX;
      const y = event.clientY;
      this.$store.dispatch("setServerMemberContext", {
        serverID: this.$store.getters["servers/currentServerID"],
        uniqueID: this.creator.uniqueID,
        x,
        y
      });
    },
    openContextMenu(event, text) {
      if (text && isElectron) {
        event.preventDefault(true);
      } else if (text && !isElectron) {
        return;
      }
      const x = event.clientX;
      const y = event.clientY;
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "MESSAGE_CONTEXT",
        x,
        y,
        channelID: this.message.channelID,
        messageID: this.message.messageID,
        message: this.message.message,
        uniqueID: this.creator.uniqueID,
        messageType: this.message.type,
        color: this.message.color
      });
    },
    openUserInformation() {
      this.$store.dispatch("setUserInformationPopout", this.creator.uniqueID);
    },
    imageClicked(event) {
      this.$store.dispatch("setImagePreviewURL", event.target.src);
    },
    editMessage() {
      if (this.creator.uniqueID !== this.user.uniqueID) return;
      this.dropDownVisable = false;
      this.$store.dispatch("setEditMessage", {
        channelID: this.message.channelID,
        messageID: this.message.messageID,
        message: this.message.message,
        color: this.message.color
      });
    },
    contentDoubleClickEvent(event) {
      if (
        event.target.classList.contains("content") ||
        event.target.closest(".user-info")
      )
        this.editMessage();
    },
    clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    },
    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth * ratio, height: srcHeight * ratio };
    },
    imageSize() {
      const files = this.message.files;
      if (!files || files.length === 0 || !files[0].dimensions)
        return undefined;

      const messageLog = document.querySelector(".message-logs");
      const w = messageLog.offsetWidth;
      const h = messageLog.offsetHeight;

      let minWidth = w / 1.7;
      let minHeight = h / 1.7;

      const dimensions = this.message.files[0].dimensions;
      const srcWidth = dimensions.width;
      const srcHeight = dimensions.height;

      const newDimentions = this.calculateAspectRatioFit(
        srcWidth,
        srcHeight,
        minWidth,
        minHeight
      );

      const imageTag = this.$refs["image"];

      imageTag.firstChild.style.width = "100%";
      imageTag.firstChild.style.height = "100%";

      imageTag.style.width =
        this.clamp(newDimentions.width, 0, srcWidth) + "px";
      imageTag.style.height =
        this.clamp(newDimentions.height, 0, srcHeight) + "px";
    },
    onResize() {
      this.imageSize();
    },
    imageContextEvent(event) {
      if (isElectron) {
        event.preventDefault(true);
      } else {
        return;
      }
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "IMAGE_CONTEXT",
        url: this.getImage,
        x: event.clientX,
        y: event.clientY
      });
    }
  },
  watch: {
    getWindowWidth(dimentions) {
      this.onResize(dimentions);
    }
  },
  mounted() {
    this.imageSize();
    setTimeout(() => (this.loaded = true));
    const files = this.files;
    if (!files || files.length === 0 || !files[0].dimensions) return undefined;
  },
  computed: {
    ...mapState("settingsModule", ["apperance"]),
    getImage() {
      if (!this.message.files || this.message.files.length === 0)
        return undefined;
      if (this.message.files[0].url) return this.message.files[0].url;
      const file = this.message.files[0];
      if (!file.fileID) return undefined;
      const filetypes = /jpeg|jpg|gif|png/;
      const extname = filetypes.test(path.extname(file.fileName).toLowerCase());
      if (!extname) return undefined;
      return config.domain + "/media/" + file.fileID + "/" + file.fileName;
    },
    getFile() {
      if (!this.message.files || this.message.files.length === 0)
        return undefined;
      let file = { ...this.message.files[0] };
      if (!file.fileID) return undefined;
      const filetypes = /jpeg|jpg|gif|png/;
      const extname = filetypes.test(path.extname(file.fileName).toLowerCase());
      if (extname) return undefined;
      file.url = config.domain + "/files/" + file.fileID + "/" + file.fileName;
      return file;
    },
    getTime() {
      return time(
        this.message.created,
        this.apperance && this.apperance["12h_time"] ? "12h" : false
      );
    },
    getDate() {
      return friendlyDate(
        this.message.created,
        this.apperance && this.apperance["12h_time"] ? "12h" : false
      );
    },
    getEditedDate() {
      return friendlyDate(
        this.message.timeEdited,
        this.apperance && this.apperance["12h_time"] ? "12h" : false
      );
    },
    user() {
      return this.$store.getters.user;
    },
    getWindowWidth() {
      return {
        width: windowProperties.resizeWidth,
        height: windowProperties.resizeHeight
      };
    },
    roles() {
      return this.$store.getters["servers/currentServerRoles"];
    },
    serverMember() {
      const serverMembers = this.$store.getters["servers/serverMembers"];
      return serverMembers.find(
        m =>
          m.uniqueID === this.creator.uniqueID &&
          m.server_id === this.$store.getters["servers/currentServerID"]
      );
    },
    roleColor() {
      if (!this.isServer) return undefined;
      if (!this.serverMember || !this.serverMember.roles) return undefined;

      const filter = this.roles.find(r =>
        this.serverMember.roles.includes(r.id)
      );
      if (filter) {
        if (filter.color) {
          return filter.color + " !important";
        } else {
          return undefined;
        }
      } else {
        return this.roles.find(r => r.default).color + " !important";
      }
    },
    isMentioned() {
      if (!this.message.mentions) return;
      const mentions = this.message.mentions;
      if (mentions.find(u => u.uniqueID === this.user.uniqueID)) {
        return true;
      }
      return false;
    },
    inviteEmbed() {
      const regex = /nertivia\.tk\/invites\/([\w]+)/;
      if (!this.message.message) return null;
      return this.message.message.match(regex);
    },
    themeEmbed() {
      const regex = /nertivia\.tk\/themes\/([\w]+)/;
      if (!this.message.message) return null;
      return this.message.message.match(regex);
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
$self-message-color: #4883db;

$message-color: #3a4750;

.active {
  background: rgba(255, 255, 255, 0.3);
}
.container {
  position: relative;
  z-index: 1;
  transition: 0.2s;
}

.drop-down-button {
  opacity: 0;
  transition: 0.2s;
  position: relative;
  z-index: 1;
}
.new-badge {
  padding: 4px;
  text-align: center;
  margin-left: 30px;
  margin-right: 30px;
  position: relative;
  font-size: 14px;
  z-index: 111111111;

  background: none !important;
  padding-bottom: 5px !important;
  
  border-bottom: 2px solid;
  border-width: 2px;
  border-image-slice: 1;
  border-image-source: linear-gradient(90deg,#d18f00,#d10000);
  margin-bottom: 20px !important;


}

.container:hover .drop-down-button {
  opacity: 1;
}

.ownMessageRight {
  flex-direction: row-reverse;
  .content-outer {
    flex-direction: row-reverse;
  }
  .drop-down-button {
    text-align: end;
  }
}

.ownMessageRight .triangle-inner {
  border-left: 8px solid $self-message-color;
  border-right: none !important;
}

.ownMessageRight .avatar {
  margin-right: 0px;
}
.ownMessageRight .sending-status {
  margin-left: auto !important;
  margin-right: 4px !important;
}

.message {
  margin: 10px;
  margin-top: 5px;
  margin-bottom: 5px;
  display: flex;
}

.ownMessage .triangle-inner {
  border-right: 8px solid $self-message-color;
}
.ownMessage .content {
  background: $self-message-color;
}

.ownMessage .date {
  color: #d5e3e6;
}

.avatar {
  margin: 0;
  height: 56px;
  width: 56px;
}

.triangle {
  display: flex;
  justify-content: bottom;
  flex-direction: column;
}

.triangle-inner {
  width: 0;
  height: 0;
  border-top: 0 solid transparent;
  border-bottom: 9px solid transparent;
  border-right: 8px solid $message-color;
}

.content {
  background: $message-color;
  padding: 10px;
  display: flex;
  flex-direction: column;
  color: rgb(231, 231, 231);
  margin: auto 0;
  overflow: hidden;
  border-radius: 4px;
  border-top-left-radius: 0;
}

.all-content {
  display: flex;  
  flex-direction: column;
  overflow: hidden;
}

.content-outer {
  display: flex;
  align-self: flex-start;
  overflow: hidden;
}
.inner-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
  overflow: hidden;
}
.ownMessageRight .content {
  border-radius: 4px;
  border-top-right-radius: 0;
}
.image-content {
  margin-top: 10px;
  padding: 5px;
  background: $embed-bg-color;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
  border-radius: 5px;
  cursor: pointer;
}
.image-content img {
  width: 100px;
  object-fit: contain;
  height: 100px;
}
.image-content:hover img {
  filter: brightness(70%);
}
.user-info {
  display: flex;
}
.username {
  color: rgb(255, 255, 255);
  font-size: 14px;
  margin: auto 0;
  transition: 0.1s;
  cursor: pointer;
  font-weight: bold;
}

.username:hover {
  color: rgb(255, 255, 255);
  text-decoration: underline;
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
.date {
  color: #d5e3e6;
  font-size: 10px;
  margin: auto auto auto 5px;
  font-weight: normal;
}
.content-message {
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 14px;
  overflow: hidden;
  max-width: 100%;
  color: white;
  margin-top: 3px;
  padding-right: 2px;
}
.other-information {
  display: flex;
  flex-direction: column;
  min-width: 20px;
  flex-shrink: 0;
  
}
.message .sending-status {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 5px;
  font-size: 15px;
  color: white;
  margin: auto auto 0 4px;
  user-select: none;
  transition: 0.5;
  align-content: center;
}

.message .other-information div .material-icons {
  font-size: 15px;
  color: rgb(306, 306, 306);
  display: block;
}

.drop-down-button .material-icons {
  font-size: 17px !important;
  user-select: none;
  cursor: pointer;
  margin-top: 5px;
}
.mentioned {
  margin-left: 5px;
  margin-right: 5px;
  flex-shrink: 0;
  color: white;
  background: rgba(255, 59, 59, 0.9);
  font-size: 13px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  margin-top: -2px;
  padding: 2px;
  height: 15px;
  width: 15px;
  border-radius: 50%;
  cursor: default;
}


.hideAdditional {
  .small-time {
    display: flex;
    color: white;
    width: 56px;
    font-size: 13px;
    align-self: center;
    text-align: center;
    justify-content: center;
    flex-shrink: 0;
    opacity: 0;
    transition: 0.2s;
  }
  &:hover .small-time {
    opacity: 0.8;
  }
  .content {
    border-radius: 4px;
    flex-direction: row;
  }
  .mentioned {
    margin-top: 0;
    margin-left: 0;
  }
  .user-info {
    margin-top: 2px;
  }
  .avatar {
    height: 15px;
    flex-shrink: 0;
  }
  .triangle {
    width: 8px;
    flex-shrink: 0;
  }
}

</style>
