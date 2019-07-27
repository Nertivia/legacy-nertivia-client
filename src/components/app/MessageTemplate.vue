<template>
  <div class="container" @mouseover="hover = true" @mouseleave="hover = false">
    <div
      v-if="!type || type === 0"
      :class="{message: true, ownMessage: user.uniqueID === $props.uniqueID, ownMessageLeft: user.uniqueID === $props.uniqueID && (apperance && apperance.own_message_right === true)} "
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
          <div class="username"
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

        <div class="image-content"
          v-if="getImage"
        >
          <img
            :src="getImage"
            @click="imageClicked"
          >
        </div>
        <message-embed-template v-if="embed && Object.keys(embed).length" :embed="embed"/>
      </div>
      <div class="other-information">
        <div class="drop-down-button" ref="drop-down-button" @click="dropDownVisable = !dropDownVisable"><i class="material-icons">more_vert</i></div>
        <div class="drop-down-menu" v-click-outside="closeDropDown" v-if="dropDownVisable">
          <div class="drop-item" @click="editMessage" v-if="user.uniqueID === uniqueID">Edit</div>
          <div class="drop-item warn" @click="deleteMessage">Delete</div>
        </div>
        <div class="sending-status" v-if="timeEdited && (status === undefined || status === 1)" :title="`Edited ${getEditedDate}`"><i class="material-icons">edit</i></div>
        <div class="sending-status" v-else-if="status === 0"><i class="material-icons">hourglass_full</i></div>
        <div class="sending-status" v-else-if="status === 1"><i class="material-icons">done</i></div>    
        <div class="sending-status" v-else-if="status === 2"><i class="material-icons">close</i> Failed</div>
      </div>

    </div>
    <div
      v-if="type && (type === 1 || type === 2)"
      :class="{'presence-message': true, green: type === 1, red: type === 2}"
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

import { mapState } from "vuex";
import messagesService from '../../services/messagesService';

export default {
  components: {
    ProfilePicture,
    messageEmbedTemplate
  },
  data() {
    return {
      dropDownVisable: false,
      hover: false
    }
  },
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
  methods: {
    openUserInformation() {
      this.$store.dispatch("setUserInformationPopout", this.uniqueID);
    },
    imageClicked(event) {
      this.$store.dispatch("setImagePreviewURL", event.target.src);
    },
    closeDropDown(event) {
      const dropDownButton = this.$refs['drop-down-button'];
      if (!dropDownButton || dropDownButton.contains(event.target)) return;
      this.dropDownVisable = false
    },
    async deleteMessage() {
      this.dropDownVisable = false;
      const {ok, error, result} = await messagesService.delete(this.messageID, this.channelID);
      
    },
    editMessage() {
      if (this.uniqueID !== this.user.uniqueID) return;
      this.dropDownVisable = false;
      this.$store.dispatch("setEditMessage", {channelID: this.channelID, messageID: this.messageID, message: this.message});
    },
    contentDoubleClickEvent(event){
      if (event.target.classList.contains("content") || event.target.closest('.user-info')) this.editMessage();
    }
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
    }
  }
};
</script>


<style scoped>
.container {
  position: relative;

}

.drop-down-button{
  opacity: 0;
  transition: 0.2s;
}
.drop-down-menu {
  position: absolute;
  z-index: 999;
  background: rgba(0, 0, 0, 0.918);
  border-radius: 10px;
  padding: 5px;
  margin-top: 25px;
  margin-left: -24px;
  color: white;
}
.drop-item {
  padding: 3px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  font-size: 13px;
}
.drop-item:hover {
  background: rgb(41, 41, 41);
}
.warn {
  color: red;
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
  animation: showMessage 0.3s ease-in-out;
}

.presence-message .text {
  margin-left: 5px;
}
.presence-message.green {
  background: rgba(0, 128, 0, 0.534);
}
.presence-message.red {
  background: rgba(128, 0, 0, 0.534);
}

.ownMessageLeft {
  flex-direction: row-reverse;
}

.ownMessageLeft .triangle-inner {
  transition: 0.5s;
  border-left: 7px solid rgba(184, 184, 184, 0.219);
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

  animation: showMessage 0.3s ease-in-out;
}

.ownMessage .triangle-inner {
  transition: 0.5s;
  border-right: 7px solid rgba(184, 184, 184, 0.219);
}
.ownMessage .content {
  background: rgba(184, 184, 184, 0.219);
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

@keyframes showMessage {
  from {
    transform: translate(0px, 9px);
    opacity: 0;
  }
}

.avatar {
  margin: auto 5px 0 0;
}

.triangle {
  display: flex;
  justify-content: bottom;
  flex-direction: column;
  margin: auto 0 8.7px 0;
}
.triangle-inner {
  width: 0;
  height: 0;

  border-top: 1px solid transparent;
  border-bottom: 7px solid transparent;
  border-right: 7px solid rgba(0, 0, 0, 0.301);
}

.content {
  background: rgba(0, 0, 0, 0.301);
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 10px;
  color: rgb(231, 231, 231);
  margin: auto 0;
  transition: 1s;
  overflow: hidden;
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
  width: 170px;
  height: auto;
  transition: 0.2s;
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
  cursor: default;
}
.username:hover {
  color: rgb(199, 199, 199);
  text-decoration: underline;
}
.date {
  color: rgb(161, 161, 161);
  font-size: 10px;
  margin: auto auto auto 5px;
}
.content-message {
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
}

img.emoji {
  height: 1.7em;
  width: auto;
  margin: 0 0.05em 0 0.1em;
}
</style>
