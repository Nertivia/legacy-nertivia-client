<template>
  <div class="container" @mouseover="hover = true" @mouseleave="hover = false">
    <div
      v-if="!type || type === 0"
      :class="{message: true, ownMessage: user.uniqueID === $props.uniqueID, halloween: user.uniqueID === $props.uniqueID, ownMessageLeft: user.uniqueID === $props.uniqueID && (apperance && apperance.own_message_right === true)} "
    >
      <div class="avatar">
        <profile-picture
          :admin="$props.admin"
          :url="`${userAvatar}${hover ? '' : '?type=png'}`"
          size="50px"
          :hover="true"
          @click.native="openUserInformation"
        />
      </div>
      <div class="triangle">
        <div class="triangle-inner" />
      </div>
      <div class="content" @dblclick="contentDoubleClickEvent">
        <div class="user-info">
          <div class="username halloween-color"
            @click="openUserInformation"
          >
            {{ this.$props.username }}
          </div>
          <div class="date">
            {{ getDate }}
          </div>
        </div>
        <div class="content-message"
          v-html="formatMessage"
        />

        <div class="file-content"
          v-if="getFile"
        >
          <div class="icon">
            <i class="material-icons">insert_drive_file</i>
          </div>
          <div class="information">
            <div class="info"> {{ getFile.fileName }}</div>
            <a
              :href="getFile.url"
              target="_blank"
            >
              <div class="download-button">Download</div>
            </a>
          </div>
        </div>

        <div class="image-content" ref="image" v-if="getImage">
          <img
            :src="getImage"
            @click="imageClicked"
          >
        </div>
        <message-embed-template v-if="embed && Object.keys(embed).length" :embed="embed"/>
      </div>
      <div class="other-information">
        <div class="drop-down-button" ref="drop-down-button" @click="openContextMenu"><i class="material-icons">more_vert</i></div>
        <div class="sending-status" v-if="timeEdited && (status === undefined || status === 1)" :title="`Edited ${getEditedDate}`"><i class="material-icons">edit</i></div>
        <div class="sending-status" v-else-if="status === 0"><i class="material-icons">hourglass_full</i></div>
        <div class="sending-status" v-else-if="status === 1"><i class="material-icons">done</i></div>    
        <div class="sending-status" v-else-if="status === 2"><i class="material-icons">close</i> Failed</div>
      </div>

    </div>
    <div
      v-if="type && (type === 1 || type === 2 || type === 3 || type === 4)"
      class="presence-message"
      :class="{join: type === 1, leave: type === 2, kick: type === 3, ban: type === 4}"
    >
      <span>
        <span class="username"
          @click="openUserInformation"
        >{{ this.$props.username }}</span>
        <span
          v-if="type === 1"
          class="text"
        >has joined the server!</span>
        <span
          v-if="type === 2"
          class="text"
        >has left the server.</span>
        <span
          v-if="type === 3"
          class="text"
        >has been kicked.</span>
        <span
          v-if="type === 4"
          class="text"
        >has been banned.</span>
        <span class="date">{{ getDate }}</span>
      </span>
    </div>
  </div>
</template>


<script>
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import messageEmbedTemplate from "./messageEmbedTemplate";
import messageFormatter from "@/utils/messageFormatter.js";
import config from "@/config.js";
import friendlyDate from "@/utils/date";
import path from "path";
import windowProperties from '@/utils/windowProperties';

import { mapState } from "vuex";
import messagesService from '../../services/messagesService';

export default {
  props: [
    "message",
    "status",
    "username",
    "avatar",
    "date",
    "uniqueID",
    "files",
    "admin",
    "type",
    "embed",
    "messageID",
    "channelID",
    "timeEdited"
  ],
  components: {
    ProfilePicture,
    messageEmbedTemplate
  },
  data() {
    return {
      hover: false
    }
  },
  methods: {
    openContextMenu(event) {
      const x = event.clientX;
      const y = event.clientY;
      this.$store.dispatch('setMessageContext', {
        x,
        y,
        channelID: this.channelID,
        messageID: this.messageID,
        message: this.message,
        uniqueID: this.uniqueID

      });
    },
    openUserInformation() {
      this.$store.dispatch("setUserInformationPopout", this.uniqueID);
    },
    imageClicked(event) {
      this.$store.dispatch("setImagePreviewURL", event.target.src);
    },
    editMessage() {
      if (this.uniqueID !== this.user.uniqueID) return;
      this.dropDownVisable = false;
      this.$store.dispatch("setEditMessage", {channelID: this.channelID, messageID: this.messageID, message: this.message});
    },
    contentDoubleClickEvent(event){
      if (event.target.classList.contains("content") || event.target.closest('.user-info')) this.editMessage();
    },
    clamp(num, min, max) {
      return num <= min ? min : num >= max ? max : num;
    },
    calculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight) {
      let ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);
      return { width: srcWidth*ratio, height: srcHeight*ratio };
    },
    imageSize() {
      const files = this.$props.files;
      if (!files || files.length === 0 || !files[0].dimensions)
        return undefined;
        
      const messageLog = document.querySelector('.message-logs');
      const w = messageLog.offsetWidth;
      const h = messageLog.offsetHeight;
      
      let minWidth = w / 4;
      let minHeight = h / 4;
      if (w <= 800) {
        minWidth = w / 1.7;
        minHeight = h / 1.7;
      }


      const dimensions = this.$props.files[0].dimensions
      const srcWidth = dimensions.width;
      const srcHeight = dimensions.height;

      const newDimentions = this.calculateAspectRatioFit(srcWidth, srcHeight, minWidth, minHeight);

      const imageTag = this.$refs['image'];

      imageTag.firstChild.style.width = "100%"
      imageTag.firstChild.style.height = "100%"

      imageTag.style.width = this.clamp(newDimentions.width, 0, srcWidth) + "px"
      imageTag.style.height = this.clamp(newDimentions.height, 0, srcHeight) + "px"
    },
    onResize(dimentions) {
      this.imageSize();
    },
  },
  watch: {
    getWindowWidth(dimentions) {
      this.onResize(dimentions)
    }
  },
  mounted() {
    const files = this.files;
    if (!files || files.length === 0 || !files[0].dimensions)
      return undefined;
    this.imageSize();
  },
  computed: {
    ...mapState("settingsModule", ["apperance"]),
    getImage() {
      if (!this.$props.files || this.$props.files.length === 0)
        return undefined;
      const file = this.$props.files[0];
      if (!file.fileID) return undefined;
      const filetypes = /jpeg|jpg|gif|png/;
      const extname = filetypes.test(path.extname(file.fileName).toLowerCase());
      if (!extname) return undefined;
      return config.domain + "/media/" + file.fileID;
    },
    getFile() {
      if (!this.$props.files || this.$props.files.length === 0)
        return undefined;
      let file = this.$props.files[0];
      if (!file.fileID) return undefined;
      const filetypes = /jpeg|jpg|gif|png/;
      const extname = filetypes.test(path.extname(file.fileName).toLowerCase());
      if (extname) return undefined;
      file.url = config.domain + "/files/" + file.fileID;
      return file;
    },
    formatMessage() {
      return messageFormatter(this.$props.message);
    },
    getDate() {
      return friendlyDate(this.$props.date);
    },
    getEditedDate() {
      return friendlyDate(this.timeEdited);
    },
    userAvatar() {
      return config.domain + "/avatars/" + this.$props.avatar;
    },
    user() {
      return this.$store.getters.user;
    },
    getWindowWidth() {
      return {width: windowProperties.resizeWidth, height: windowProperties.resizeHeight};
    },
  }
};
</script>


<style scoped>
.container {
  position: relative;
  z-index: 1;
}

.drop-down-button{
  opacity: 0;
  transition: 0.2s;
  position: relative;
  z-index: 1;
}



.container:hover .drop-down-button{
  opacity: 1;
}
.presence-message {
  margin: 10px;
  padding: 10px;
  display: table;
  color: white;
  overflow: hidden;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.356);
}

.presence-message .text {
  margin-left: 5px;
  font-size: 15px;
}
.presence-message .username {
  font-size: 15px;
  font-weight: bold
}
.presence-message.join {
  color: #29BF12;
}
.presence-message.leave {
  color: rgb(150, 139, 139);
}
.presence-message.kick {
  color: #FF9914;
}
.presence-message.ban {
  color: #d92121;
}

.ownMessageLeft {
  flex-direction: row-reverse;
}

.ownMessageLeft .triangle-inner {
  border-left: 8px solid rgba(184, 184, 184, 0.219);
  border-right: none !important;
}
.ownMessageLeft .avatar {
  margin-right: 0px;
  margin-left: 5px;
}
.ownMessageLeft .sending-status {
  margin-left: auto !important;
  margin-right: 4px !important;
}

.message {
  margin: 10px;
  display: flex;
}

.ownMessage .triangle-inner {
  border-right: 8px solid rgba(184, 184, 184, 0.219);
}
.ownMessage .content {
  background: rgba(184, 184, 184, 0.219);
}
.ownMessage.halloween .content {
  background: rgba(255, 135, 31, 0.43);
}
.ownMessage .date {
  color: rgb(209, 209, 209);
}

.file-content {
  display: flex;
  background: rgba(0, 0, 0, 0.089);
  padding: 10px;
  margin-top: 5px;
}
.file-content .material-icons {
  font-size: 40px;
}
.file-content .download-button {
  font-size: 14px;
  background: rgba(0, 0, 0, 0.158);
  border-radius: 3px;
  padding: 3px;
  text-align: center;
  display: inline-block;
  margin-top: 3px;
  transition: 0.3s;
  user-select: none;
  cursor: default;
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
  margin: auto 5px 0 0;
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
    border-right: 8px solid rgba(0, 0, 0, 0.301);
}

.content {
  background: rgba(0, 0, 0, 0.301);
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  border-bottom-left-radius: 0;
  color: rgb(231, 231, 231);
  margin: auto 0;
  overflow: hidden;
}
.ownMessageLeft .content {
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 0;
}
.image-content {
  margin-top: 10px;
  padding: 5px;
  border-radius: 5px;
  background: rgba(0, 0, 0, 0.493);
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
  color: rgb(219, 219, 219);
  font-size: 14px;
  margin: auto 0;
  transition: 0.1s;
  cursor: pointer;
}

.username:hover {
  color: rgb(199, 199, 199);
  text-decoration: underline;
}
.username.halloween-color {
  color: orange
}
.date {
  color: rgb(177, 177, 177);
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

@media (max-width: 468px) {

}

</style>

<style>

.code-inline{
  background: rgba(0, 0, 0, 0.322);
}
.msg-link {
  color: rgb(86, 159, 253);
}

pre {
  padding: 0;
  margin: 0;
}

.codeblock {
  background-color: rgba(0, 0, 0, 0.397);
  padding: 5px;
  border-radius: 5px;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

.content-message img.emoji {
  object-fit: contain;
  height: 2em;
  width: 2em;
  margin: 1px;
  vertical-align: -9px;
}
</style>
