<template>
  <div
    class="message-container container"
    :class="{ 'mentioned-message': isMentioned, hideAdditional }"
    @mouseover="mouseOverEvent"
    @mouseleave="hover = false"
  >
    <div
      v-if="!message.type || message.type === 0"
      :class="{
        message: true,
        ownMessage: user.uniqueID === creator.uniqueID,
        ownMessageRight:
          user.uniqueID === creator.uniqueID &&
          apperance &&
          apperance.own_message_right === true
      }"
    >
      <div class="small-time" v-if="hideAdditional" :title="getDate">{{ getTime }}</div>
      <div class="avatar" v-if="!hideAdditional">
        <profile-picture
          :admin="creator.admin"
          :url="`${userAvatar}${hover || !isGif ? '' : '?type=webp'}`"
          size="50px"
          :hover="true"
          @click.native="openUserInformation"
        />
      </div>
      <div class="triangle">
        <div class="triangle-inner" v-if="!hideAdditional" />
      </div>
      <div class="content" @dblclick="contentDoubleClickEvent">
        <div class="user-info">
          <div
            v-if="!hideAdditional"
            class="username"
            :style="{ color: loaded ? roleColor : null }"
            @click="openUserInformation"
          >
            {{ creator.username }}
          </div>
          <div class="date" v-if="!hideAdditional">{{ getDate }}</div>
          <div
            class="mentioned material-icons"
            v-if="isMentioned"
            title="You were mentioned"
          >
            alternate_email
          </div>
        </div>
        <div class="inner-content">
          <SimpleMarkdown
            class="content-message"
            :style="[
              message.color && message.color !== -2
                ? { color: message.color }
                : ''
            ]"
            :message="message.message"
          />
          <div
            class="file-content"
            v-if="getFile && !getFile.fileName.endsWith('.mp3')"
          >
            <div class="icon">
              <i class="material-icons">insert_drive_file</i>
            </div>
            <div class="information">
              <div class="info">{{ getFile.fileName }}</div>
              <a :href="getFile.url" download target="_blank">
                <div class="download-button">Download</div>
              </a>
            </div>
          </div>
          <div
            v-if="getFile && getFile.fileName.endsWith('.mp3')"
            class="file-content music"
          >
            <div class="info">{{ getFile.fileName }}</div>
            <audio controls>
              <source :src="getFile.url" type="audio/mp3" />
            </audio>
          </div>

          <div class="image-content" ref="image" v-if="getImage">
            <img :src="getImage" @click="imageClicked" />
          </div>
          <message-embed-template
            v-if="message.embed && Object.keys(message.embed).length"
            :embed="message.embed"
          />
        </div>
      </div>
      <div class="other-information">
        <div
          class="drop-down-button"
          ref="drop-down-button"
          @click="openContextMenu"
        >
          <i class="material-icons">more_vert</i>
        </div>
        <div
          class="sending-status"
          v-if="
            message.timeEdited &&
              (message.status === undefined || message.status === 1)
          "
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
    <div v-if="messageType" class="presence-message" :class="messageType[1]">
      <div class="presense-contain">
        <span>
          <span class="username" @click="openUserInformation">{{
            creator.username
          }}</span>
          <span class="text">{{ messageType[0] }}</span>

          <span class="date">{{ getDate }}</span>
        </span>
      </div>
      <div
        class="drop-down-button"
        ref="drop-down-button"
        @click="openContextMenu"
      >
        <i class="material-icons">more_vert</i>
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import SimpleMarkdown from "./SimpleMarkdown.vue";
import messageEmbedTemplate from "./messageEmbedTemplate";
import config from "@/config.js";
import friendlyDate, { time } from "@/utils/date";
import path from "path";
import windowProperties from "@/utils/windowProperties";

import { mapState } from "vuex";

export default {
  props: ["creator", "message", "isServer", "hideAdditional"],
  components: {
    ProfilePicture,
    messageEmbedTemplate,
    SimpleMarkdown
  },
  data() {
    return {
      hover: false,
      isGif: false,
      loaded: false
    };
  },
  methods: {
    mouseOverEvent() {
      if (this.isGif) {
        this.hover = true;
      }
    },
    openContextMenu(event) {
      const x = event.clientX;
      const y = event.clientY;
      this.$store.dispatch("setMessageContext", {
        x,
        y,
        channelID: this.message.channelID,
        messageID: this.message.messageID,
        message: this.message.message,
        uniqueID: this.creator.uniqueID,
        type: this.message.type,
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
    this.isGif = this.userAvatar.endsWith(".gif");
    const files = this.files;
    if (!files || files.length === 0 || !files[0].dimensions) return undefined;
  },
  computed: {
    ...mapState("settingsModule", ["apperance"]),
    getImage() {
      if (!this.message.files || this.message.files.length === 0)
        return undefined;
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
      let file = this.message.files[0];
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
    userAvatar() {
      return config.domain + "/avatars/" + this.creator.avatar;
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
      return this.$store.getters["servers/selectedServerRoles"];
    },
    serverMember() {
      const serverMembers = this.$store.getters["servers/serverMembers"];
      return serverMembers.find(
        m =>
          m.uniqueID === this.creator.uniqueID &&
          m.server_id === this.$store.getters["servers/selectedServerID"]
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
    messageType() {
      switch (this.message.type) {
        case 1:
          return ["joined the server!", "join"];
          break;
        case 2:
          return ["left the server.", "leave"];
          break;
        case 3:
          return ["has been kicked.", "kick"];
          break;
        case 4:
          return ["has been banned.", "ban"];
          break;
        default:
          return null;
          break;
      }
    },
    isMentioned() {
      if (!this.message.mentions) return;
      const mentions = this.message.mentions;
      if (mentions.find(u => u.uniqueID === this.user.uniqueID)) {
        return true;
      }
      return false;
    }
  }
};
</script>

<style scoped lang="scss">
$self-message-color: rgba(255, 255, 255, 0.1);
$message-color: rgba(0, 0, 0, 0.3);

.container {
  position: relative;
  z-index: 1;
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
.drop-down-button {
  opacity: 0;
  transition: 0.2s;
  position: relative;
  z-index: 1;
}

.container:hover .drop-down-button {
  opacity: 1;
}
.presence-message {
  margin: 10px;
  display: flex;
  color: white;
  overflow: hidden;
}

.presense-contain {
  padding: 10px;
  display: table;
  color: white;
  overflow: hidden;
  background: $message-color;
  border-radius: 4px;
}

.presence-message .text {
  margin-left: 5px;
  font-size: 15px;
}
.presence-message .username {
  font-size: 15px;
  font-weight: bold;
}
.presence-message.join .text {
  color: #29bf12;
}
.presence-message.leave .text {
  color: rgb(150, 139, 139);
}
.presence-message.kick .text {
  color: #ff9914;
}
.presence-message.ban .text {
  color: #d92121;
}

.ownMessageRight {
  flex-direction: row-reverse;
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

.file-content {
  display: flex;
  background: #ffffff21;
  padding: 10px;
  margin-top: 5px;
  &.music {
    .info {
      margin-bottom: 5px;
    }
    flex-direction: column;
  }
}

.file-content .material-icons {
  font-size: 40px;
}
.file-content .download-button {
  font-size: 14px;
  background: rgba(0, 0, 0, 0.158);
  padding: 3px;
  text-align: center;
  display: inline-block;
  margin-top: 3px;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
  color: white;
}
.file-content .download-button:hover {
  background: rgba(0, 0, 0, 0.329);
}
.file-content .info {
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  font-size: 14px;
  overflow: hidden;
  max-width: 100%;
  color: white;
  overflow-wrap: anywhere;
  margin-top: 3px;
}

.avatar {
  margin: auto 0 0 0;
  height: 56px;
  width: 56px;
}

.triangle {
  display: flex;
  justify-content: bottom;
  flex-direction: column;
  margin: auto 0 0 0;
}

.triangle-inner {
  width: 0;
  height: 0;
  border-top: 9px solid transparent;
  border-bottom: 0px solid transparent;
  border-right: 8px solid $message-color;
}

.content {
  background: $message-color;
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  // border-radius: 10px;
  border-bottom-left-radius: 0;
  color: rgb(231, 231, 231);
  margin: auto 0;
  overflow: hidden;
  border-radius: 4px;
  border-bottom-left-radius: 0;
}
.inner-content {
  display: flex;
  justify-content: center;
  flex-direction: column;
}
.ownMessageRight .content {
  border-radius: 4px;
  border-bottom-right-radius: 0;
}
.image-content {
  margin-top: 10px;
  padding: 5px;
  background: #ffffff21;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
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
}
.other-information {
  display: flex;
  flex-direction: column;
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
@media (max-width: 468px) {
}
</style>
