<template>
  <div class="right-panel">
    <heading
      :uniqueID="
        recipients && recipients.length ? recipients[0].uniqueID : undefined
      "
      :type="
        selectedChannelID && channel && !channel.server_id
          ? 1
          : channel && channel.server_id
          ? 2
          : 0
      "
      :name="
        selectedChannelID ? channelName : `Welcome back, ${user.username}!`
      "
    />
    <div class="loading" v-if="selectedChannelID && !selectedChannelMessages">
      <spinner />
    </div>
    <message-logs
      v-else-if="selectedChannelID && selectedChannelMessages"
      :key="selectedChannelID"
    />
    <div class="no-channel-selected" v-if="!selectedChannelID">
      <div class="material-icons">
        {{ type === 0 ? "chat" : type === 1 ? "forum" : "question" }}
      </div>
      <div class="message">
        {{
          type === 0
            ? "Select a person to message!"
            : type === 1
            ? "Select a server!"
            : "wot"
        }}
      </div>
    </div>
    <div class="chat-input-area" v-if="selectedChannelID">
      <div class="typing-outer">
        <typing-status
          v-if="typingRecipients[selectedChannelID]"
          :recipients="typingRecipients[selectedChannelID]"
        />
      </div>
      <div style="position: relative;">
        <transition name="show-up">
          <div
            class="back-to-bottom-button"
            @click="backToTopButton"
            v-if="!scrolledDown && selectedChannelMessages"
          >
            Back to bottom
            <i class="material-icons">keyboard_arrow_down</i>
          </div>
        </transition>
        <emoji-suggestions v-if="emojiArray" :emojiArray="emojiArray" />
        <mentions-popout v-if="mentionsArray" :list="mentionsArray" />
        <emoji-panel v-if="showEmojiPanel" @close="showEmojiPanel = false" />
      </div>

      <edit-panel v-if="editMessage" :data="editMessage" />
      <div
        class="markdown-buttons"
        style="color: white;"
        v-if="
          (sendChannelMessagePermission === true &&
            roleSendMessagePermission) ||
            editMessage
        "
      >
        <div
          class="material-icons markdown-icon"
          @click="addFormat('**')"
          title="Bold"
        >
          format_bold
        </div>
        <div
          class="material-icons markdown-icon"
          @click="addFormat('_')"
          title="Italic"
        >
          format_italic
        </div>
        <div
          class="material-icons markdown-icon"
          @click="addFormat('__')"
          title="Underline"
        >
          format_underlined
        </div>
        <div
          class="material-icons markdown-icon"
          @click="addFormat('```\n', '\n```', 4)"
          title="Code block"
        >
          code
        </div>
        <div class="color-picker" title="Message color">
          <input
            type="color"
            ref="colorPic"
            style="display: none"
            @change="messageColorChange"
            value="#e7e7e7"
          />
          <div
            class="color"
            :style="{ background: customColor }"
            @click="$refs.colorPic.click()"
          ></div>
          <div
            class="reset-button"
            @click="customColor = null"
            v-if="customColor"
          >
            Reset
          </div>
        </div>
      </div>
      <div
        class="message-area"
        v-if="
          (sendChannelMessagePermission === true &&
            roleSendMessagePermission) ||
            editMessage
        "
      >
        <input
          type="file"
          ref="sendFileBrowse"
          @change="attachmentChange"
          class="hidden"
        />
        <div class="attachment-button" @click="attachmentButton">
          <i class="material-icons">attach_file</i>
        </div>
        <textarea
          class="chat-input"
          rows="1"
          ref="input-box"
          placeholder="Message"
          @keydown="keyDown"
          @keyup="keyUp"
          @change="resize"
          @input="onInput"
          v-model="message"
          @paste="onPaste"
        ></textarea>
        <button class="emojis-button" @click="showEmojiPanel = !showEmojiPanel">
          <i class="material-icons">tag_faces</i>
        </button>
        <button
          class="send-button"
          :class="{ 'error-send-button': messageLength > 5000 }"
          @click="editMessage ? updateMessage() : sendMessage()"
        >
          <i class="material-icons">{{ editMessage ? "edit" : "send" }}</i>
          <div
            v-if="
              messageLength >= 4500 &&
                ((sendChannelMessagePermission === true &&
                  roleSendMessagePermission) ||
                  editMessage)
            "
            :class="{
              'message-count': true,
              'error-info': messageLength > 5000
            }"
          >
            {{ messageLength }} / 5000
          </div>
        </button>
      </div>
    </div>
    <div
      class="no-message-permission"
      v-if="
        sendChannelMessagePermission === false ||
          roleSendMessagePermission === false
      "
    >
      You don't have permission to send messages in this channel.
    </div>
  </div>
</template>

<script>
import messagesService from "@/services/messagesService";
import typingService from "@/services/TypingService";
import { bus } from "../../main";
import Spinner from "@/components/Spinner.vue";
import heading from "@/components/app/MessagePanel/Heading.vue";
import emojiSuggestions from "@/components/app/EmojiPanels/emojiSuggestions.vue";
import mentionsPopout from "@/components/app/mentionsPopout.vue";
import MessageLogs from "@/components/app/MessageLogs.vue";
import emojiParser from "@/utils/emojiParser.js";
import windowProperties from "@/utils/windowProperties";
import TypingStatus from "@/components/app/TypingStatus.vue";
import { isMobile } from "../../utils/Mobile";
import { permissions, containsPerm } from "@/utils/RolePermissions";

const emojiPanel = () => import("@/components/app/EmojiPanels/emojiPanel.vue");
const EditPanel = () => import("@/components/app/EditPanel.vue");

export default {
  props: ["type"], // type 0: dm; type 1: server
  components: {
    Spinner,
    emojiSuggestions,
    emojiPanel,
    heading,
    EditPanel,
    MessageLogs,
    TypingStatus,
    mentionsPopout
  },
  data() {
    return {
      message: "",
      messageLength: 0,
      postTimerID: null,
      typingTimer: null,
      typing: false,
      typingRecipients: {},
      showEmojiPanel: false,

      customColor: null,
      scrolledDown: true,
      mobile: isMobile()
    };
  },
  methods: {
    messageColorChange(e) {
      const hexColor = e.target.value;
      e.target.value = "";
      this.customColor = hexColor;
    },
    addFormat(type, customEnding, customPos) {
      const msgBox = this.$refs["input-box"];
      msgBox.focus();
      const startPos = msgBox.selectionStart;
      const endPos = msgBox.selectionEnd;

      const selection = window.getSelection();
      const selected = selection.toString();

      if (selected === "") {
        this.message = [
          this.message.slice(0, endPos),
          type + (customEnding || type),
          this.message.slice(endPos)
        ].join("");
        this.$nextTick(() => {
          const offsetCursorPos = customPos || type.length;
          msgBox.focus();
          msgBox.setSelectionRange(
            endPos + offsetCursorPos,
            endPos + offsetCursorPos
          );
        });
        return;
      }
      this.message = [
        this.message.slice(0, startPos),
        type + selected + (customEnding || type),
        this.message.slice(endPos)
      ].join("");
      this.$nextTick(() => {
        msgBox.focus();
        msgBox.setSelectionRange(startPos + type.length, endPos + type.length);
      });
    },
    generateNum(n) {
      var add = 1,
        max = 12 - add; // 12 is the min safe number Math.random() can generate without it starting to pad the end with zeros.

      if (n > max) {
        return this.generateNum(max) + this.generateNum(n - max);
      }

      max = Math.pow(10, n + add);
      var min = max / 10; // Math.pow(10, n) basically
      var number = Math.floor(Math.random() * (max - min + 1)) + min;

      return ("" + number).substring(add);
    },
    replaceMentions(message) {
      const regex = /@([\w\d\s_-]+):([\w\d_-]+)/g;

      return message.replace(regex, word => {
        const [username, tag] = word.split(":");
        if (tag.length !== 4 || !username || !tag) return word;
        const member = Object.values(this.members).find(
          m => "@" + m.username === username && m.tag === tag
        );
        if (!member) return word;
        return `<@${member.uniqueID}>`;
      });
    },
    async sendMessage() {
      this.$refs["input-box"].focus();
      this.message = this.message.trim();

      if (this.message == "") return;
      if (this.message.length > 5000) return;
      this.$store.dispatch("setEmojiArray", null);
      clearInterval(this.postTimerID);
      this.postTimerID = null;

      let msg = emojiParser.replaceShortcode(this.message);
      msg = this.replaceMentions(msg);

      const tempID = this.generateNum(25);

      this.$store.dispatch("addMessage", {
        sender: true,
        channelID: this.selectedChannelID,
        message: {
          tempID,
          message: msg,
          color: this.customColor,
          channelID: this.selectedChannelID,
          created: new Date()
        }
      });

      this.message = "";

      let input = this.$refs["input-box"];
      input.style.height = "1em";

      this.$store.dispatch("updateChannelLastMessage", this.selectedChannelID);
      const { ok, error, result } = await messagesService.post(
        this.selectedChannelID,
        {
          message: msg,
          color: this.customColor,
          socketID: this.$socket.client.id,
          tempID
        }
      );
      if (ok) {
        const message = result.data.messageCreated;
        message.status = 1;
        this.$store.dispatch("replaceMessage", {
          tempID: result.data.tempID,
          message
        });
      } else {
        // TODO: Error handling
        console.log(error);
      }
    },
    async updateMessage() {
      const editMessage = this.editMessage;
      this.$refs["input-box"].focus();
      this.message = this.message.trim();
      if (
        this.message === this.editMessage.message &&
        (this.customColor || undefined) === this.editMessage.color
      ) {
        this.$store.dispatch("setEditMessage", null);
        this.message = "";
        return;
      }
      if (this.message == "") return;
      if (this.message.length > 5000) return;
      this.$store.dispatch("setEmojiArray", null);
      clearInterval(this.postTimerID);
      this.postTimerID = null;

      const msg = emojiParser.replaceShortcode(this.message);
      this.$store.dispatch("updateMessage", {
        channelID: editMessage.channelID,
        messageID: editMessage.messageID,
        message: { message: msg, status: 0 }
      });
      this.$store.dispatch("setEditMessage", null);
      this.message = "";

      const { ok } = await messagesService.update(
        editMessage.messageID,
        editMessage.channelID,
        {
          color: this.customColor || -1,
          message: msg
        }
      );
      if (ok) {
        this.$store.dispatch("updateMessage", {
          channelID: editMessage.channelID,
          messageID: editMessage.messageID,
          message: { status: 1 }
        });
      } else {
        this.$store.dispatch("updateMessage", {
          channelID: editMessage.channelID,
          messageID: editMessage.messageID,
          message: { message: msg, status: 2 }
        });
      }
    },
    async postTimer() {
      this.postTimerID = setTimeout(async () => {
        if (this.message.trim() == "") {
          clearInterval(this.postTimerID);
          this.postTimerID = null;
        } else {
          if (this.selectedChannelID)
            await typingService.post(this.selectedChannelID);

          if (this.postTimerID) this.postTimer();
        }
      }, 2000);
    },
    resize() {
      let input = this.$refs["input-box"];
      if (!input) return;
      if (input.scrollHeight < 50 || !this.message) {
        input.style.height = "1em";
      } else {
        input.style.height = "auto";
        input.style.height = `calc(${input.scrollHeight}px - 1em)`;
      }
      bus.$emit("scrollDown");
    },
    mentionsSwitchKey(event) {
      if (!this.mentionsArray) return;
      if (event.keyCode === 38) {
        bus.$emit("mentions:key", "up");
        event.preventDefault();
        return;
      }
      if (event.keyCode === 40) {
        bus.$emit("mentions:key", "down");
        event.preventDefault();
        return;
      }
    },
    emojiSwitchKey(event) {
      if (!this.emojiArray) return;

      const keyCode = event.keyCode;

      if (keyCode == 38) {
        //up
        bus.$emit("emojiSuggestions:key", "up");
        event.preventDefault();
        return;
      }
      if (keyCode == 40) {
        //down
        bus.$emit("emojiSuggestions:key", "down");
        event.preventDefault();
        return;
      }
    },
    ReturnWord(text, caretPos) {
      var preText = text.substring(0, caretPos);
      if (preText.indexOf(" ") > 0) {
        var words = preText.split(" ");
        return words[words.length - 1]; //return last word
      } else {
        return preText;
      }
    },
    showEmojiPopout(event) {
      if (event.keyCode == 38 || event.keyCode == 40) return; // up/down
      const message = this.$refs["input-box"].value;
      const cursorPosition = event.target.selectionStart;
      const cursorWord = this.ReturnWord(message, cursorPosition);
      const cursorLetter = message.substring(
        cursorPosition - 1,
        cursorPosition
      );

      if (cursorLetter.trim() == "" || cursorWord.endsWith(":"))
        return this.$store.dispatch("setEmojiArray", null);

      if (!cursorWord.startsWith(":") || cursorWord.length <= 2)
        return this.$store.dispatch("setEmojiArray", null);

      const searchArr = emojiParser.searchEmoji(
        cursorWord.slice(1, cursorWord.length)
      );
      if (searchArr.length <= 0)
        return this.$store.dispatch("setEmojiArray", null);

      this.$store.dispatch("setEmojiArray", searchArr.slice(0, 10));
    },
    showMentionsPopout(event) {
      if (event.keyCode == 38 || event.keyCode == 40) return; // up/down
      const message = this.$refs["input-box"].value;
      const cursorPosition = event.target.selectionStart;
      const cursorWord = this.ReturnWord(message, cursorPosition);

      if (!cursorWord.startsWith("@")) {
        this.$store.dispatch("mentionsListModule/setMentionsArray", null);
        return;
      }
      // word without @
      const wordWithoutBegining = cursorWord
        .slice(1, cursorWord.length)
        .toLowerCase();

      let searchedMembers = [];

      for (let index = 0; index < this.serverMembers.length; index++) {
        const serverMember = this.serverMembers[index];
        if (serverMember.server_id != this.server.server_id) continue;
        const member = this.members[serverMember.uniqueID];
        if (
          member.username
            .toLowerCase()
            .replace(/\s/g, "")
            .includes(wordWithoutBegining)
        ) {
          searchedMembers.push(member);
        }
      }
      searchedMembers = searchedMembers.slice(0, 9);
      this.$store.dispatch(
        "mentionsListModule/setMentionsArray",
        searchedMembers
      );
    },
    async onInput(event) {
      const value = event.target.value.trim();
      if (value && this.postTimerID == null) {
        this.postTimer();
        await typingService.post(this.selectedChannelID);
      }
    },
    keyUp(event) {
      setTimeout(() => {
        this.showMentionsPopout(event);
        this.showEmojiPopout(event);
      }, 10);
    },
    enterMention() {
      const member = this.mentionsArray[this.mentionsListIndex];
      if (!member) return;
      this.$store.dispatch("mentionsListModule/setMentionsArray", null);
      const cursorPosition = this.$refs["input-box"].selectionStart;
      const cursorWord = this.ReturnWord(this.message, cursorPosition);
      const start = cursorPosition - cursorWord.length;
      const end = cursorPosition;

      this.message =
        this.message.substring(0, start) +
        `@${member.username}:${member.tag} ` +
        this.message.substring(end);
    },
    enterEmojiSuggestion() {
      const emoji = this.emojiArray[this.emojiIndex];
      this.$store.dispatch(
        "settingsModule/addRecentEmoji",
        emoji.name || emoji.shortcodes[0]
      );
      this.$refs["input-box"].focus();
      const emojiShortCode = `:${emoji.name || emoji.shortcodes[0]}: `;
      const cursorPosition = this.$refs["input-box"].selectionStart;
      const cursorWord = this.ReturnWord(this.message, cursorPosition);

      const start = cursorPosition - cursorWord.length;
      const end = cursorPosition;

      this.message =
        this.message.substring(0, start) +
        emojiShortCode +
        this.message.substring(end);
      this.$store.dispatch("setEmojiArray", null);
    },
    enterEmojiPanel(shortcode) {
      const target = this.$refs["input-box"];
      if (!target) return;
      target.focus();
      const isSuccessful = document.execCommand(
        "insertText",
        false,
        `:${shortcode}: `
      );

      if (!isSuccessful) {
        this.message = this.message + `:${shortcode}: `;
      }
      target.blur();
      this.$store.dispatch("settingsModule/addRecentEmoji", shortcode);
    },
    keyDown(event) {
      this.mentionsSwitchKey(event);
      this.emojiSwitchKey(event);
      // when enter is press
      if (event.keyCode == 13) {
        if (this.mobile) {
          return;
        }
        // and the shift key is not held
        if (!event.shiftKey) {
          event.preventDefault();
          if (this.emojiArray) {
            this.enterEmojiSuggestion();
            return;
          }
          if (
            this.mentionsArray &&
            this.mentionsArray[this.mentionsListIndex]
          ) {
            this.enterMention();
            return;
          }
          if (this.editMessage) {
            return this.updateMessage();
          } else {
            this.sendMessage();
          }
        }
      }

      if (event.keyCode === 38) {
        //38 = up arrow
        if (this.message !== "") return;
        if (this.editMessage) return;
        const messagesFiltered = this.selectedChannelMessages.filter(
          m => m.creator.uniqueID === this.user.uniqueID
        );

        if (!messagesFiltered.length) return;
        event.preventDefault();
        const lastMessage = messagesFiltered[messagesFiltered.length - 1];
        this.$store.dispatch("setEditMessage", {
          messageID: lastMessage.messageID,
          channelID: lastMessage.channelID,
          message: lastMessage.message,
          color: lastMessage.color
        });
      }
    },
    hideTypingStatus(data) {
      if (this.user.uniqueID === data.message.creator.uniqueID) return;
      if (
        !this.typingRecipients[data.channelID] ||
        !this.typingRecipients[data.channelID][data.message.creator.uniqueID]
      )
        return;
      clearTimeout(
        this.typingRecipients[data.channelID][data.message.creator.uniqueID]
          .timer
      );
      this.$delete(
        this.typingRecipients[data.channelID],
        data.message.creator.uniqueID
      );
    },
    attachmentButton() {
      this.$refs.sendFileBrowse.click();
    },
    uploadFile(file) {
      // 1073741824 = 1GB || 1024GB
      const sizeLimit = 1073741824;
      if (file.size >= sizeLimit) {
        //show a warning.
        return;
      }
      this.$store.dispatch("setFile", file);
      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: true
      });
    },
    attachmentChange(event) {
      const file = event.target.files[0];
      event.target.value = "";
      this.uploadFile(file);
    },
    onPaste(event) {
      var items = (event.clipboardData || event.originalEvent.clipboardData)
        .items;
      for (let index in items) {
        var item = items[index];
        if (item.kind === "file") {
          var blob = item.getAsFile();
          this.$store.dispatch("setFile", blob);
          this.$store.dispatch("setPopoutVisibility", {
            name: "uploadDialog",
            visibility: true
          });
          break;
        }
      }
    },
    async onFocus() {
      if (this.message.trim() !== "") {
        await typingService.post(this.selectedChannelID);
        this.postTimer();
      }
      bus.$emit("title:change", "Nertivia");
      if (!this.$store.getters.selectedChannelID) return;
      //dismiss notification on focus
      const find = this.$store.getters.notifications.find(notification => {
        return notification.channelID === this.$store.getters.selectedChannelID;
      });
      if (find && find.count >= 1) {
        this.$socket.client.emit("notification:dismiss", {
          channelID: this.$store.getters.selectedChannelID
        });
      }
    },
    backToTopButton() {
      bus.$emit("backToBottom");
    },
    editMessageEvent(editMessage) {
      this.message = editMessage
        ? emojiParser.emojiToShortcode(editMessage.message)
        : "";
      if (editMessage) this.customColor = editMessage.color || null;
    },
    onBlur() {
      clearTimeout(this.postTimerID);
      this.postTimerID = null;
    },
    onTyping(data) {
      const { channel_id, user } = data;
      const typingRecipients = this.typingRecipients[channel_id];

      if (
        this.selectedChannelID !== channel_id ||
        user.unique_id === this.user.uniqueID
      )
        return;
      if (typingRecipients === undefined) {
        this.$set(this.typingRecipients, channel_id, {
          [user.unique_id]: { username: user.username }
        });
      } else if (!typingRecipients[user.unique_id]) {
        this.$set(this.typingRecipients[channel_id], user.unique_id, {
          username: user.username
        });
      }

      clearTimeout(this.typingRecipients[channel_id][user.unique_id].timer);

      this.typingRecipients[channel_id][user.unique_id].timer = setTimeout(
        () => {
          this.$delete(this.typingRecipients[channel_id], user.unique_id);
        },
        3500
      );
    }
  },
  mounted() {
    this.$socket.client.on("typingStatus", this.onTyping);

    bus.$on("newMessage", this.hideTypingStatus);
    bus.$on("emojiSuggestions:Selected", this.enterEmojiSuggestion);
    bus.$on("mentions:Selected", this.enterMention);
    bus.$on("emojiPanel:Selected", this.enterEmojiPanel);

    bus.$on("scrolledDown", scrolledDown => {
      this.scrolledDown = scrolledDown;
    });

    window.addEventListener("blur", this.onBlur);
    window.addEventListener("focus", this.onFocus);
  },

  beforeDestroy() {
    clearTimeout(this.postTimerID);
    this.postTimerID = null;

    bus.$off("newMessage", this.hideTypingStatus);
    bus.$off("emojiSuggestions:Selected", this.enterEmojiSuggestion);
    bus.$off("emojiPanel:Selected", this.enterEmojiPanel);
    bus.$off("mentions:Selected", this.enterMention);
    window.removeEventListener("focus", this.onFocus);
    window.removeEventListener("blur", this.onBlur);

    this.$socket.client.off("typingStatus", this.onTyping);
  },
  watch: {
    editMessage(editMessage) {
      this.editMessageEvent(editMessage);
      this.$refs["input-box"].focus();
    },
    message(message) {
      this.messageLength = message.length;
      this.$nextTick(this.resize);
    },
    selectedChannelID() {
      this.$nextTick(() => {
        if (!this.mobile && this.$refs["input-box"])
          this.$refs["input-box"].focus();
      });
    }
  },
  computed: {
    uploadQueue() {
      const allUploads = this.$store.getters.getAllUploads;
      const selectedChannelID = this.$store.getters.selectedChannelID;

      const filteredArray = [];

      for (let upload in allUploads) {
        if (allUploads[upload].channelID === selectedChannelID) {
          filteredArray.push(allUploads[upload]);
        }
      }
      if (!filteredArray.length) return undefined;
      return filteredArray;
    },
    user() {
      return this.$store.getters.user;
    },
    channel() {
      return this.$store.getters.channels[this.selectedChannelID];
    },
    server() {
      if (!this.channel) return false;
      if (!this.channel.server_id) return false;
      return (
        this.$store.getters["servers/servers"][this.channel.server_id] ||
        undefined
      );
    },
    members() {
      const members = this.$store.getters["members/members"];
      return members;
    },
    serverMembers() {
      const serverMembers = this.$store.getters["servers/serverMembers"];
      return serverMembers.reverse();
    },
    serverMember() {
      return this.$store.getters["servers/serverMembers"].find(
        sm =>
          sm.server_id === this.server.server_id &&
          sm.uniqueID === this.user.uniqueID
      );
    },
    myRolePermissions() {
      if (!this.serverMember) return undefined;
      const roles = this.$store.getters["servers/selectedServerRoles"];
      if (!roles) return undefined;

      let perms = 0;

      if (this.serverMember.roles) {
        for (let index = 0; index < roles.length; index++) {
          const role = roles[index];
          if (this.serverMember.roles.includes(role.id)) {
            perms = perms | (role.permissions || 0);
          }
        }
      }

      const defaultRole = roles.find(r => r.default);
      perms = perms | defaultRole.permissions;
      return perms;
    },
    roleSendMessagePermission() {
      if (this.type !== 1) return true;
      if (!this.channel) return null;

      if (!this.server) return false;
      return !!containsPerm(
        this.myRolePermissions || 0,
        permissions.SEND_MESSAGES.value
      );
    },
    sendChannelMessagePermission() {
      if (this.type !== 1) return true;
      if (!this.channel) return null;

      if (!this.server) return false;

      if (this.server.creator.uniqueID === this.user.uniqueID) return true;
      if (!this.channel.permissions) return true;
      if (this.channel.permissions.send_message === undefined) return true;
      return this.channel.permissions.send_message;
    },
    selectedChannelMessages() {
      const selectedChannel = this.$store.getters.selectedChannelID;
      return this.$store.getters.messages[selectedChannel];
    },
    selectedChannelID() {
      return this.$store.getters.selectedChannelID;
    },
    channelName() {
      return this.$store.getters.channelName;
    },
    emojiArray() {
      return this.$store.getters.emojiArray;
    },
    mentionsArray() {
      return this.$store.getters["mentionsListModule/mentionsArray"];
    },
    emojiIndex() {
      return this.$store.getters.getEmojiIndex;
    },
    mentionsListIndex() {
      return this.$store.getters["mentionsListModule/getMentionIndex"];
    },
    recipients() {
      const selectedChannel = this.$store.getters.selectedChannelID;
      const channel = this.$store.getters.channels[selectedChannel];
      return channel ? channel.recipients : undefined;
    },
    editMessage() {
      let editMessage = this.$store.getters.popouts.editMessage;
      if (!editMessage) return null;
      return editMessage;
    },
    getWindowWidth() {
      return {
        width: windowProperties.resizeWidth,
        height: windowProperties.resizeHeight
      };
    }
  }
};
</script>

<style lang="scss" scoped>
.show-up-enter-active,
.show-up-leave-active {
  transition: 0.3s;
}
.show-up-enter, .show-up-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(10px);
}

.no-channel-selected {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  align-content: center;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  .message {
    margin-top: 20px;
    text-align: center;
  }
  .material-icons {
    font-size: 50px;
  }
}
.typing-outer {
  display: flex;
  margin-bottom: 5px;
  position: absolute;
  top: -25px;
  left: 0;
  right: 0;
  z-index: 1;
}
.hidden {
  display: none;
}

.error-info {
  color: red;
}

.right-panel {
  height: 100%;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  background: rgba(0, 0, 0, 0.4);
}
.message-logs {
  overflow: auto;
  flex: 1;
  position: relative;
}

.loading {
  overflow: auto;
  flex: 1;
}
.chat-input-area {
  display: flex;
  flex-direction: column;
  padding-bottom: 10px;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
}

.attachment-button {
  width: 50px;
  margin-right: 2px;
  display: flex;
  flex-shrink: 0;
  color: #a5bec4;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;

  &:hover {
    color: white;
  }
  .material-icons {
    margin: auto;
  }
}

.seperater {
  height: 1px;
  width: calc(100% - 10px);
  align-self: center;
  background-color: #a0c8d5;
  flex-shrink: 0;
}
.chat-input-area .info {
  color: rgba(255, 255, 255, 0.466);
  font-size: 12px;
  margin-left: 13px;
  margin-top: 5px;
  display: flex;
}

.message-count {
  font-size: 15px;
}

.message-area {
  display: flex;
  width: 100%;
}

.chat-input {
  font-family: "Montserrat", sans-serif;
  background: transparent;
  color: white;
  width: 100%;
  min-height: 20px;
  padding: 10px;
  margin: auto;
  font-size: 15px;
  resize: none;
  border: none;
  outline: none;
  transition: background 0.2s;
  height: 1em;
  overflow: hidden;
  max-height: 30vh;
  overflow-y: auto;
  &::placeholder {
    color: #597981;
  }
}

.send-button {
  font-size: 20px;
  color: #a5bec4;
  background: transparent;
  border: none;
  outline: none;
  min-height: 40px;
  width: 50px;
  transition: 0.3s;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  user-select: none;
  overflow: hidden;
  cursor: pointer;
  align-items: center;
  .material-icons {
    margin: auto;
  }
  &:hover {
    color: white;
  }
}

.error-send-button {
  background-color: rgba(255, 0, 0, 0.294);
  &:hover {
    background-color: rgba(255, 0, 0, 0.294);
  }
}

.emojis-button {
  font-size: 20px;
  color: #a5bec4;
  background: transparent;
  border: none;
  outline: none;
  margin-left: 2px;
  cursor: pointer;
  min-height: 40px;
  width: 50px;
  transition: 0.3s;
  display: flex;
  flex-shrink: 0;
  user-select: none;
  .material-icons {
    margin: auto;
  }
  &:hover {
    color: white;
  }
}

.back-to-bottom-button {
  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
  transition: 0.2s;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(3px);
  border-radius: 100px;
  color: white;
  position: absolute;
  bottom: 30px;
  right: 25px;
  height: 52px;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  align-content: center;
  align-items: center;
  padding-left: 15px;
  padding-right: 10px;
  user-select: none;
  cursor: pointer;
  .material-icons {
    align-self: center;
    flex-shrink: 0;
    font-size: 25px;
  }
}

.no-message-permission {
  background: rgba(0, 0, 0, 0.5);
  color: white;
  text-align: center;
  padding: 5px;
  user-select: none;
  cursor: default;
}
.markdown-buttons {
  display: flex;
  height: 35px;
  align-items: center;
  align-content: center;
  margin-left: 2px;
  margin-bottom: 10px;
  flex-shrink: 0;
  .markdown-icon {
    font-size: 21px;
    flex-shrink: 0;
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    height: 100%;
    width: 30px;
    margin-left: 0px;
    transition: 0.2s;
    color: #a5bec4;
    &:hover {
      color: white;
    }
  }
}

.color-picker {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  transition: 0.2s;
  flex-shrink: 0;
  min-width: 35px;
  .color {
    width: 15px;
    height: 15px;
    background: rgb(231, 231, 231);
    flex-shrink: 0;
    cursor: pointer;
    border-radius: 3px;
  }
  .reset-button {
    color: #a5bec4;
    user-select: none;
    cursor: pointer;
    margin-left: 5px;
    transition: 0.2s;
    flex-shrink: 0;
    &:hover {
      color: white;
    }
  }
}
</style>
