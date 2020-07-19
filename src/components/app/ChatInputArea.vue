<template>
  <div class="chat-input-area">
    <div class="typing-outer">
      <typing-status
        v-if="typingRecipients[currentChannelID]"
        :recipients="typingRecipients[currentChannelID]"
      />
    </div>
    <div style="position: relative;">
      <transition name="show-up">
        <div
          class="back-to-bottom-button"
          @click="backToTopButton"
          v-if="!scrolledDown && currentChannelMessages"
        >
          <i class="material-icons">keyboard_arrow_down</i>
        </div>
      </transition>

      <emoji-suggestions
        @chosen="enterEmojiSuggestion"
        v-if="emojiSuggestionsArr.length"
        :emojiArray="emojiSuggestionsArr"
        ref="emojiSuggestionsList"
      />
      <mentions-popout
        @chosen="enterMention"
        ref="mentionSuggestionsList"
        v-if="mentionSuggestionsArr.length"
        :list="mentionSuggestionsArr"
      />
      <channels-popout
        @chosen="enterChannel"
        ref="channelSuggestionsList"
        v-if="channelSuggestionsArr.length"
        :list="channelSuggestionsArr"
      />

      <emoji-panel v-if="showEmojiPanel" @close="showEmojiPanel = false" />
    </div>

    <edit-panel v-if="editMessage" :data="editMessage" />
    <ChatMarkdownArea
      v-model="customColor"
      v-if="
        (sendChannelMessagePermission === true && roleSendMessagePermission) ||
          editMessage
      "
    />

    <div
      class="message-area"
      v-if="
        (sendChannelMessagePermission === true && roleSendMessagePermission) ||
          editMessage
      "
    >
      <input type="file" ref="sendFileBrowse" style="display: none" @change="attachmentChange" />
      <div class="attachment-button" title="Attach File" @click="$refs.sendFileBrowse.click()">
        <i class="material-icons">attach_file</i>
      </div>
      <textarea
        class="chat-input"
        rows="1"
        ref="input-box"
        :placeholder="$t('send-a-message')"
        @keydown="keyDown"
        @keyup="keyUp"
        @change="resize"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @contextmenu="openTextAreaContext"
        v-model="message"
        @paste="onPaste"
      ></textarea>
      <button class="emojis-button" title="Draw" @click="showDraw">
        <i class="material-icons">brush</i>
      </button>
      <button class="emojis-button" title="Emojis" @click="showEmojiPanel = !showEmojiPanel">
        <i class="material-icons">tag_faces</i>
      </button>
      <button
        class="send-button"
        title="Send Message"
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
            'error-info': messageLength > 5000,
          }"
        >{{ messageLength }} / 5000</div>
      </button>
    </div>
  </div>
</template>

<script>
import TypingStatus from "@/components/app/TypingStatus.vue";
import { bus } from "../../main";
import TypingService from "../../services/TypingService";
import isElectron from "../../utils/ElectronJS/isElectron";
import { containsPerm, permissions } from "../../utils/RolePermissions";
import messagesService from "../../services/messagesService";
import emojiParser from "../../utils/emojiParser";
import { isMobile } from "../../utils/Mobile";
import ChatMarkdownArea from "@/components/app/ChatMarkdownArea";

const mentionsPopout = () => import("@/components/app/mentionsPopout.vue");
const channelsPopout = () => import("@/components/app/channelsPopout.vue");
const emojiSuggestions = () =>
  import("@/components/app/EmojiPanels/emojiSuggestions.vue");
const emojiPanel = () => import("@/components/app/EmojiPanels/emojiPanel.vue");
const EditPanel = () => import("@/components/app/EditPanel.vue");

export default {
  props: ["typingRecipients", "type"],
  components: {
    emojiSuggestions,
    emojiPanel,
    EditPanel,
    TypingStatus,
    mentionsPopout,
    ChatMarkdownArea,
    channelsPopout
  },
  data() {
    return {
      scrolledDown: true,
      showEmojiPanel: false,
      messageLength: 0,
      customColor: null,
      mobile: isMobile(),

      emojiSuggestionsArr: [],
      mentionSuggestionsArr: [],
      channelSuggestionsArr: []
    };
  },
  methods: {
    attachmentChange(event) {
      const file = event.target.files[0];
      event.target.value = "";
      this.uploadFile(file);
    },
    keyDown(event) {
      this.mentionsSwitchKey(event);
      this.emojiSwitchKey(event);
      this.channelsSwitchKey(event);
      // when enter is press

      if (event.ctrlKey && event.key === "e") {
        event.preventDefault();
        this.showEmojiPanel = !this.showEmojiPanel;
      }
      if (event.keyCode == 9) {
        if (this.enterPopout()) event.preventDefault();
      }
      if (event.keyCode == 13) {
        if (this.mobile) {
          return;
        }
        // and the shift key is not held
        if (!event.shiftKey) {
          event.preventDefault();
          if (this.enterPopout()) return;
          if (this.editMessage) {
            return this.updateMessage();
          } else {
            this.sendMessage();
          }
        }
      }

      if (event.keyCode === 38 && !event.altKey) {
        //38 = up arrow
        if (this.message !== "") return;
        if (this.editMessage) return;
        if (!this.currentChannelMessages) return;
        const messagesFiltered = this.currentChannelMessages.filter(
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
    keyUp(event) {
      this.showPopouts(event);
    },
    showPopouts(event) {
      setTimeout(() => {
        this.showMentionsPopout(event);
        this.showChannelsPopout(event);
        this.showEmojiPopout(event);
      }, 10);
    },
    resize() {
      const input = this.$refs["input-box"];
      if (!input) return;
      if (input.scrollHeight < 50 || !this.message) {
        input.style.height = "1em";
      } else {
        input.style.height = "auto";
        input.style.height = `calc(${input.scrollHeight}px - 1em)`;
      }
      bus.$emit("scrollDown");
    },
    async postTypingTimer() {
      this.postTimerID = setTimeout(async () => {
        if (this.message.trim() == "") {
          clearInterval(this.postTimerID);
          this.postTimerID = null;
        } else {
          if (this.currentChannelID)
            await TypingService.post(this.currentChannelID);

          if (this.postTimerID) this.postTypingTimer();
        }
      }, 2000);
    },
    async onInput(event) {
      const value = event.target.value.trim();
      if (value && this.postTimerID == null) {
        this.postTypingTimer();
        await TypingService.post(this.currentChannelID);
      }
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
    openTextAreaContext(event) {
      if (isElectron) {
        event.preventDefault(true);
        const x = event.clientX;
        const y = event.clientY;
        this.$store.dispatch("setAllPopout", {
          show: true,
          type: "TEXT_AREA_CONTEXT",
          x,
          y,
          input: this.$refs["input-box"]
        });
      }
    },
    showDraw() {
      const shown = !!this.$store.getters.popouts.allPopout.unclosableType;
      this.$store.dispatch("setAllPopout", {
        show: true,
        unclosableType: shown ? undefined : "DRAW_POPOUT"
      });
    },
    
    replaceChannelMentions(message) {
      const getChannel = name => this.channels.find(c => c.name === name);
      const isChannel = name => name != null && getChannel(name)

      const result = [];
      const reg = /#([^#]+?)#/g;
      let name;

      let lastIndex = reg.lastIndex;
      let i = 0;

      while ((name = reg.exec(message)) !== null) {
        if (isChannel(name[1])) {
          const channelName = name[1];
          result.push(message.slice(lastIndex, name.index))
          result.push(`<#${getChannel(channelName).channelID}>`)
          lastIndex = name.index + name[0].length
        } else {
          reg.lastIndex = lastIndex + i;
        }
        i += 1;
      }
      result.push(message.slice(lastIndex))
      return result.join('');
    },

    replaceMentions(message) {
      const regex = /@([^@]+?(?=:)):([\w]*)/g;

      return message.replace(regex, word => {
        const [username, tag] = word.split(":");
        if (!username || !tag) return word;
        const member = Object.values(this.members).find(
          m => "@" + m.username === username && m.tag === tag
        );
        if (!member) return word;
        return `<@${member.uniqueID}>`;
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
    messageSetup(genTempID = false) {
      let msg = emojiParser.replaceShortcode(this.message);
      msg = this.replaceMentions(msg);
      msg = this.replaceChannelMentions(msg);

      let tempID;
      if (genTempID) tempID = this.generateNum(25);
      return {
        msg, tempID
      }
    },
    async sendMessage() {
      this.$refs["input-box"].focus();
      this.message = this.message.trim();

      if (this.message == "") return;
      if (this.message.length > 5000) return;
      this.emojiSuggestionsArr = [];
      clearInterval(this.postTimerID);
      this.postTimerID = null;

      const {msg, tempID} = this.messageSetup(true);

      const addMessage = {
        sender: true,
        channelID: this.currentChannelID,
        message: {
          tempID,
          message: msg,
          color: this.customColor,
          channelID: this.currentChannelID,
          created: new Date()
        }
      };
      if (!this.customColor) {
        delete addMessage.message.color;
      }

      this.$store.dispatch("addMessage", addMessage);

      this.message = "";

      let input = this.$refs["input-box"];
      input.style.height = "1em";
      this.$store.dispatch("updateChannelLastMessage", this.currentChannelID);
      const post = {
        message: msg,
        color: this.customColor,
        socketID: this.$socket.client.id,
        tempID
      };
      if (!this.customColor) {
        delete post.color;
      }
      const { ok, error, result } = await messagesService.post(
        this.currentChannelID,
        post
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

        this.$store.dispatch("replaceMessage", {
          tempID: tempID,
          message: { ...addMessage.message, status: 2, messageID: "0111" }
        });
        let message;

        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          message = error.response.data.message;
        } else {
          message = "Something went wrong while sending the message.";
        }
        this.$store.dispatch("addMessage", {
          channelID: this.currentChannelID,
          message: {
            creator: {
              username: "Whoopsies!",
              uniqueID: "12345678",
              bot: true,
            },
            message: message,
            messageID: Math.floor(Math.random() * 10999 + 0).toString(),
            color: "#ff4d4d",
            channelID: this.currentChannelID,
            created: new Date()
          }
        });
      }
    },
    async updateMessage() {
      const editMessage = this.editMessage;
      this.message = this.message.trim();
      if (this.message === "") {
        this.$refs["input-box"].blur();
        this.$store.dispatch("setAllPopout", {
          show: true,
          type: "DELETE_CONFIRM",
          messageID: editMessage.messageID,
          channelID: editMessage.channelID
        });
        this.$store.dispatch("setEditMessage", null);
        return;
      }
      this.$refs["input-box"].focus();
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
      this.emojiSuggestionsArr = [];
      clearInterval(this.postTimerID);
      this.postTimerID = null;

      const {msg} = this.messageSetup();
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
    cursorWord(text, caretPos) {
      var preText = text.substring(0, caretPos).replace(/\n/g, " ");
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
      const cursorWord = this.cursorWord(message, cursorPosition);
      const cursorLetter = message.substring(
        cursorPosition - 1,
        cursorPosition
      );

      if (cursorLetter.trim() == "" || cursorWord.endsWith(":"))
        return (this.emojiSuggestionsArr = []);

      if (!cursorWord.startsWith(":") || cursorWord.length <= 2)
        return (this.emojiSuggestionsArr = []);

      const searchArr = emojiParser.searchEmoji(
        cursorWord.slice(1, cursorWord.length)
      );
      if (searchArr.length <= 0) return (this.emojiSuggestionsArr = []);

      this.emojiSuggestionsArr = searchArr.slice(0, 10);
    },
    showMentionsPopout(event) {
      if (event.keyCode == 38 || event.keyCode == 40) return; // up/down
      if (!this.$refs["input-box"]) return;
      const message = this.$refs["input-box"].value;
      const cursorPosition = event.target.selectionStart;
      const cursorWord = this.cursorWord(message, cursorPosition);

      if (!cursorWord.startsWith("@")) {
        this.mentionSuggestionsArr = [];
        return;
      }
      // word without @
      const wordWithoutBegining = cursorWord
        .slice(1, cursorWord.length)
        .toLowerCase();

      let searchedMembers = [];

      // DM Tab
      if (this.currentTab === 1) {
        // add self
          if (this.user.username.toLowerCase().replace(/\s/g, "").includes(wordWithoutBegining)) {
            searchedMembers.push(this.user);
          }
        const recipients = this.channel.recipients;
        for (let index = 0; index < recipients.length; index++) {
          const recipient = recipients[index];
            if (recipient.username.toLowerCase().replace(/\s/g, "").includes(wordWithoutBegining)) {
            searchedMembers.push(recipient);
          }
        }

      } else {
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
      }
      searchedMembers = searchedMembers.slice(0, 9);
      this.mentionSuggestionsArr = searchedMembers;
    },
    showChannelsPopout(event) {
      if (event.keyCode == 38 || event.keyCode == 40) return; // up/down
      const inputBox = this.$refs["input-box"].value;
      const cursorPosition = event.target.selectionStart;
      const cursorWord = this.cursorWord(inputBox, cursorPosition);
      const cursorLetter = inputBox.substring(
        cursorPosition - 1,
        cursorPosition
      );

      if (cursorLetter.trim() == "" || cursorWord.endsWith("#"))
        return (this.channelSuggestionsArr = []);

      if (!cursorWord.startsWith("#")) return (this.channelSuggestionsArr = []);
      // word without #
      const wordWithoutBegining = cursorWord
        .slice(1, cursorWord.length)
        .toLowerCase();

      this.channelSuggestionsArr = [];
      for (let index = 0; index < this.channels.length; index++) {
        const channel = this.channels[index];
        const name = channel.name.toLowerCase().replace(/\s/g, "");
        if (name.includes(wordWithoutBegining)) {
          this.channelSuggestionsArr.push(channel);
        }
      }
    },

    enterPopout() {
      if (this.emojiSuggestionsArr.length) {
        this.enterEmojiSuggestion();
        return true;
      }
      if (this.mentionSuggestionsArr.length) {
        this.enterMention();
        return true;
      }
      if (this.channelSuggestionsArr.length) {
        this.enterChannel();
        return true;
      }
    },
    enterEmojiSuggestion() {
      const emoji = this.emojiSuggestionsArr[
        this.$refs.emojiSuggestionsList.index
      ];
      this.$store.dispatch(
        "settingsModule/addRecentEmoji",
        emoji.name || emoji.shortcodes[0]
      );
      this.$refs["input-box"].focus();
      const emojiShortCode = `:${emoji.name || emoji.shortcodes[0]}: `;
      const cursorPosition = this.$refs["input-box"].selectionStart;
      const cursorWord = this.cursorWord(this.message, cursorPosition);

      const start = cursorPosition - cursorWord.length;
      const end = cursorPosition;

      this.message =
        this.message.substring(0, start) +
        emojiShortCode +
        this.message.substring(end);
      this.emojiSuggestionsArr = [];
    },
    enterMention() {
      const member = this.mentionSuggestionsArr[
        this.$refs.mentionSuggestionsList.index
      ];
      if (!member) return;
      this.mentionSuggestionsArr = [];
      const cursorPosition = this.$refs["input-box"].selectionStart;
      const cursorWord = this.cursorWord(this.message, cursorPosition);
      const start = cursorPosition - cursorWord.length;
      const end = cursorPosition;

      this.message =
        this.message.substring(0, start) +
        `@${member.username}:${member.tag} ` +
        this.message.substring(end);
    },
    enterChannel() {
      const channel = this.channelSuggestionsArr[
        this.$refs.channelSuggestionsList.index
      ];
      if (!channel) return;
      this.channelSuggestionsArr = [];
      const cursorPosition = this.$refs["input-box"].selectionStart;
      const cursorWord = this.cursorWord(this.message, cursorPosition);
      const start = cursorPosition - cursorWord.length;
      const end = cursorPosition;

      this.message =
        this.message.substring(0, start) +
        `#${channel.name}#` +
        this.message.substring(end);
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

    mentionsSwitchKey(event) {
      if (!this.mentionSuggestionsArr.length) return;
      if (event.keyCode === 38) {
        this.$refs.mentionSuggestionsList.KeySwitch("up");
        event.preventDefault();
        return;
      }
      if (event.keyCode === 40) {
        this.$refs.mentionSuggestionsList.KeySwitch("down");
        event.preventDefault();
        return;
      }
    },
    channelsSwitchKey(event) {
      if (!this.channelSuggestionsArr.length) return;
      if (event.keyCode === 38) {
        this.$refs.channelSuggestionsList.KeySwitch("up");
        event.preventDefault();
        return;
      }
      if (event.keyCode === 40) {
        this.$refs.channelSuggestionsList.KeySwitch("down");
        event.preventDefault();
        return;
      }
    },
    emojiSwitchKey(event) {
      if (!this.emojiSuggestionsArr.length) return;

      const keyCode = event.keyCode;

      if (keyCode == 38) {
        //up
        this.$refs.emojiSuggestionsList.KeySwitch("up");
        event.preventDefault();
        return;
      }
      if (keyCode == 40) {
        //down
        this.$refs.emojiSuggestionsList.KeySwitch("down");
        event.preventDefault();
        return;
      }
    },

    async onFocus() {
      if (this.message.trim() !== "") {
        await TypingService.post(this.currentChannelID);
        this.postTypingTimer();
      }
    },
    onBlur() {
      clearTimeout(this.postTimerID);
      this.postTimerID = null;
    },
    editMessageEvent(editMessage) {
      this.message = editMessage
        ? emojiParser.emojiToShortcode(editMessage.message)
        : "";
      // replace mention <@1234> with test:owo1
      this.message = this.message.replace(/<@([\d]+)>/g, test => {
        const ID = test.slice(2, test.length - 1);
        const member = this.members[ID];
        if (!member) return test;
        return `@${member.username}:${member.tag}`;
      });
      if (editMessage) this.customColor = editMessage.color || null;
    },
    scrollDownEvent(scrolledDown) {
      this.scrolledDown = scrolledDown;
    },
    backToTopButton() {
      bus.$emit("backToBottom");
    },
    insert(message) {
      const msgBox = this.$refs["input-box"];
      msgBox.focus();
      const endPos = msgBox.selectionEnd;

      const selection = window.getSelection();
      const selected = selection.toString();

      if (selected === "") {
        this.message = [
          this.message.slice(0, endPos),
          message,
          this.message.slice(endPos)
        ].join("");

        this.$nextTick(() => {
          const offsetCursorPos = message.length;
          msgBox.focus();
          msgBox.setSelectionRange(
            endPos + offsetCursorPos,
            endPos + offsetCursorPos
          );
        });
      }
    }
  },
  watch: {
    editMessage(editMessage) {
      this.editMessageEvent(editMessage);
      if (editMessage) {
        this.$refs["input-box"].focus();
      }
    },
    message(message) {
      this.messageLength = message.length;
      this.$nextTick(this.resize);
    },
    currentChannelID() {
      this.showPopouts(event);
      this.$nextTick(() => {
        if (!this.mobile && this.$refs["input-box"])
          this.$refs["input-box"].focus();
      });
    }
  },
  computed: {
    currentTab() {
      return this.$store.getters.currentTab;
    },
    message: {
      get: function() {
        return this.$store.getters.message;
      },
      set: function(value) {
        this.$store.dispatch("setMessage", value);
      }
    },
    user() {
      return this.$store.getters.user;
    },
    currentChannelID() {
      return this.$store.getters.currentChannelID;
    },
    currentChannelMessages() {
      return this.$store.getters.messages[this.currentChannelID];
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
    members() {
      const members = this.$store.getters["members/members"];
      return members;
    },
    editMessage() {
      return this.$store.getters.popouts.editMessage;
    },
    myRolePermissions() {
      if (!this.serverMember) return undefined;
      const roles = this.$store.getters["servers/currentServerRoles"];
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
    sendChannelMessagePermission() {
      if (this.type !== 1) return true;
      if (!this.channel) return null;

      if (!this.server) return false;

      if (this.server.creator.uniqueID === this.user.uniqueID) return true;
      if (!this.channel.permissions) return true;
      if (this.channel.permissions.send_message === undefined) return true;
      return this.channel.permissions.send_message;
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
    channel() {
      return this.$store.getters.channels[this.currentChannelID];
    },
    server() {
      if (!this.channel) return false;
      if (!this.channel.server_id) return false;
      return (
        this.$store.getters["servers/servers"][this.channel.server_id] ||
        undefined
      );
    },
    channels() {
      if (!this.server) return [];
      return Object.values(this.$store.getters.channels).filter(
        c => c.server_id === this.server.server_id
      );
    }
  },
  mounted() {
    bus.$on("insertInputMessage", this.insert);
    bus.$on("emojiPanel:Selected", this.enterEmojiPanel);
    bus.$on("scrolledDown", this.scrollDownEvent);
  },
  beforeDestroy() {
    clearTimeout(this.postTimerID);
    this.postTimerID = null;
  },
  destroyed() {
    bus.$off("insertInputMessage", this.insert);
    bus.$off("emojiPanel:Selected", this.enterEmojiPanel);
    bus.$off("scrolledDown", this.scrollDownEvent);
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

.chat-input-area {
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.6);
  background: #1f2329;
}
.message-area {
  display: flex;
  width: 100%;
  padding-bottom: 5px;
}

.message-count {
  font-size: 15px;
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
    color: rgba(255, 255, 255, 0.4);
  }
}

.send-button {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.5);
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

.attachment-button {
  width: 50px;
  margin-right: 2px;
  display: flex;
  flex-shrink: 0;
  color: rgba(255, 255, 255, 0.5);
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

.typing-outer {
  display: flex;
  margin-bottom: 5px;
  position: absolute;
  top: -31px;
  left: 0;
  right: 0;
  z-index: 1;
}

.emojis-button {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.5);
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
  height: 50px;
  width: 50px;
  z-index: 2;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  align-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  .material-icons {
    align-self: center;
    flex-shrink: 0;
    font-size: 25px;
  }
}
</style>
