<template>
  <div class="right-panel">
    <heading
      :uniqueID="recipients && recipients.length ? recipients[0].uniqueID : undefined"
      :type="selectedChannelID && channel && !channel.server_id ? 1 : channel && channel.server_id ? 2 : 0"
      :status-color="userStatusColor"
      :name="selectedChannelID ? channelName : `Welcome back, ${user.username}!` "
    />
    <div class="loading" v-if="selectedChannelID && !selectedChannelMessages">
      <spinner/>
    </div>
    <div v-else-if="selectedChannelID" class="message-logs" @wheel="invertScroll">
      <div class="scroll">
        <message
          v-for="(msg, index) in selectedChannelMessages"
          :key="index"
          :date="msg.created"
          :admin="msg.creator.admin"
          :username="msg.creator.username"
          :uniqueID="msg.creator.uniqueID"
          :avatar="msg.creator.avatar"
          :message="msg.message"
          :embed="msg.embed"
          :files="msg.files"
          :status="msg.status"
          :messageID="msg.messageID"
          :channelID="msg.channelID"
          :type="msg.type"
          :timeEdited="msg.timeEdited"
        />
        <uploadsQueue v-if="uploadQueue !== undefined" :queue="uploadQueue"/>
      </div>
    </div>
    <div class="no-channel-selected" v-if="!selectedChannelID ">
      <div class="material-icons">chat</div>
      <div class="message">Select a person to message!</div>
    </div>
    <div class="chat-input-area" v-if="selectedChannelID">
      <div style="position: relative;">
        <emoji-suggestions v-if="emojiArray" :emojiArray="emojiArray"/>
        <emoji-panel v-if="showEmojiPanel" @close="showEmojiPanel = false"/>
      </div>

        <edit-panel v-if="editMessage" :data='editMessage' />
      <div class="message-area">
        <input type="file" ref="sendFileBrowse" @change="attachmentChange" class="hidden">
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
          <i class="material-icons">face</i>
        </button>
        <button
          :class="{'send-button': true, 'error-send-button': messageLength > 5000}"
          @click="editMessage ? updateMessage() : sendMessage()"
        >
          <i class="material-icons">{{editMessage ? 'edit' : 'send'}}</i>
        </button>
      </div>
      <div class="info">
        <div class="typing-outer">
          <typing-status
            v-if="typingRecipients[selectedChannelID]"
            :recipients="typingRecipients[selectedChannelID]"
          />
        </div>
        <div
          :class="{'message-count': true, 'error-info': messageLength > 5000 }"
        >{{messageLength}}/5000</div>
      </div>
    </div>
  </div>
</template>

<script>
import messagesService from "@/services/messagesService";
import typingService from "@/services/TypingService";
import { bus } from "../../main";
import JQuery from "jquery";
let $ = JQuery;
import Message from "../../components/app/MessageTemplate.vue";
import Spinner from "@/components/Spinner.vue";
import TypingStatus from "@/components/app/TypingStatus.vue";
import uploadsQueue from "@/components/app/uploadsQueue.vue";
import heading from "@/components/app/MessagePanel/Heading.vue";
import emojiSuggestions from "@/components/app/EmojiPanels/emojiSuggestions.vue";
import emojiParser from "@/utils/emojiParser.js";
import statuses from "@/utils/statuses";

const emojiPanel = () => import("@/components/app/EmojiPanels/emojiPanel.vue");
const EditPanel = () => import("@/components/app/EditPanel.vue");

export default {
  components: {
    Message,
    Spinner,
    TypingStatus,
    uploadsQueue,
    emojiSuggestions,
    emojiPanel,
    heading,
    EditPanel
  },
  data() {
    return {
      message: "",
      messageLength: 0,
      postTimerID: null,
      typingTimer: null,
      typing: false,
      typingRecipients: {},
      showEmojiPanel: false
    };
  },
  methods: {
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
    async sendMessage() {
      this.$refs["input-box"].focus();
      this.message = this.message.trim();

      if (this.message == "") return;
      if (this.message.length > 5000) return;
      this.$store.dispatch("setEmojiArray", null);
      clearInterval(this.postTimerID);
      this.postTimerID = null;
      this.messageLength = 0;

      const msg = emojiParser.replaceShortcode(this.message);

      const tempID = this.generateNum(25);

      this.$store.dispatch("addMessage", {
        sender: true,
        channelID: this.selectedChannelID,
        message: {
          tempID,
          message: msg,
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
          socketID: this.$socket.id,
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
      if (this.message === this.editMessage.message){
        this.$store.dispatch("setEditMessage", null);
        this.message = "";
        return;
      }
      if (this.message == "") return;
      if (this.message.length > 5000) return;
      this.$store.dispatch("setEmojiArray", null);
      clearInterval(this.postTimerID);
      this.postTimerID = null;
      this.messageLength = 0;

      const msg = emojiParser.replaceShortcode(this.message);
      this.$store.dispatch('updateMessage', {
        channelID: editMessage.channelID,
        messageID: editMessage.messageID,
        message: {message: msg, status: 0}
      })
      this.$store.dispatch("setEditMessage", null);
      this.message = "";

      const {ok, error, result} = await messagesService.update(editMessage.messageID, editMessage.channelID, {
        message: msg
      })
      if (ok) {
        this.$store.dispatch('updateMessage', {
          channelID: editMessage.channelID,
          messageID: editMessage.messageID,
          message: {status: 1}
        })
      } else {
        this.$store.dispatch('updateMessage', {
          channelID: editMessage.channelID,
          messageID: editMessage.messageID,
          message: {message: msg, status: 2}
        })
      }
    },
    async postTimer() {
      this.postTimerID = setTimeout(async () => {
        if (this.message.trim() == "") {
          clearInterval(this.postTimerID);
          this.postTimerID = null;
        }else {
          if (this.selectedChannelID)
            await typingService.post(this.selectedChannelID);
          
          if (this.postTimerID)
            this.postTimer()
        }
      }, 2000)
    },
    resize(event) {
      let input = this.$refs["input-box"];

      if (input.scrollHeight < 50) {
        input.style.height = "1em";
      } else {
        input.style.height = "auto";
        input.style.height = `calc(${input.scrollHeight}px - 1em)`;
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
      var index = text.indexOf(caretPos);
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

      const cursorPosition = event.target.selectionStart;
      const cursorWord = this.ReturnWord(this.message, cursorPosition);
      const cursorLetter = this.message.substring(
        cursorPosition - 1,
        cursorPosition
      );

      if (cursorLetter.trim() == "" || cursorWord.endsWith(":"))
        return this.$store.dispatch("setEmojiArray", null);

      if (!cursorWord.startsWith(":") || cursorWord.length <= 2)
        return this.$store.dispatch("setEmojiArray", null);

      const searchArr = emojiParser.searchEmoji(cursorWord.slice(1, -1));
      if (searchArr.length <= 0)
        return this.$store.dispatch("setEmojiArray", null);

      this.$store.dispatch("setEmojiArray", searchArr);
    },
    async onInput(event) {
      this.resize(event);
      this.messageLength = this.message.length;
      const value = event.target.value.trim();
      if (value && this.postTimerID == null) {
        this.postTimer();
        await typingService.post(this.selectedChannelID);
      }
    },
    keyUp(event) {
      this.resize(event);
      this.showEmojiPopout(event);
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
      target.focus();
      const isSuccessful = document.execCommand("insertText", false, `:${shortcode}: `);

      if (!isSuccessful) {
        this.message = this.message +  `:${shortcode}: `;
      }
      target.blur();
      this.$store.dispatch("settingsModule/addRecentEmoji", shortcode);
    },
    keyDown(event) {
      this.resize(event);
      this.emojiSwitchKey(event);
      // when enter is press
      if (event.keyCode == 13) {
        // and the shift key is not held
        if (!event.shiftKey) {
          event.preventDefault();
          if (this.emojiArray) {
            this.enterEmojiSuggestion();
            return;
          }
          if (this.editMessage) {
            return this.updateMessage()
          } else {
            this.sendMessage();
          }
        }
      }

      if (event.keyCode === 38){ //38 = up arrow
        if (this.message !== "") return;
        if (this.editMessage) return;
        const messagesFiltered = this.selectedChannelMessages.filter(m => m.creator.uniqueID === this.user.uniqueID);

        if (!messagesFiltered.length) return;
        event.preventDefault();
        const lastMessage = messagesFiltered[messagesFiltered.length - 1];
        this.$store.dispatch("setEditMessage", {
          messageID: lastMessage.messageID,
          channelID: lastMessage.channelID,
          message: lastMessage.message
        });

      }

    },
    invertScroll(event) {
      if (event.deltaY) {
        event.preventDefault();
        event.currentTarget.scrollTop -=
          parseFloat(
            getComputedStyle(event.currentTarget).getPropertyValue("font-size")
          ) *
          (event.deltaY < 0 ? -1 : 1) *
          2;
      }
    },
    hideTypingStatus(data) {
      if (this.user.uniqueID === data.message.creator.uniqueID) return;
      if (!this.typingRecipients[data.channelID] || !this.typingRecipients[data.channelID][data.message.creator.uniqueID]) return;
      clearTimeout( this.typingRecipients[data.channelID][data.message.creator.uniqueID].timer );
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
    async onFocus(event) {
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
        this.$socket.emit("notification:dismiss", {
          channelID: this.$store.getters.selectedChannelID
        });
      }
    }
  },
  mounted() {
    this.$options.sockets.typingStatus = data => {
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
        2500
      );
    };

    bus.$on("newMessage", this.hideTypingStatus);
    bus.$on("emojiSuggestions:Selected", this.enterEmojiSuggestion);
    bus.$on("emojiPanel:Selected", this.enterEmojiPanel);
    window.onblur = () => {
      clearTimeout(this.postTimerID);
      this.postTimerID = null;
    }
    window.addEventListener('focus', this.onFocus)

  },
  
  beforeDestroy() {
    clearTimeout(this.postTimerID);
    this.postTimerID = null;
    bus.$off("newMessage", this.hideTypingStatus);
    bus.$off("emojiSuggestions:Selected", this.enterEmojiSuggestion);
    bus.$on("emojiPanel:Selected", this.enterEmojiPanel);
    window.removeEventListener('focus', this.onFocus)
    delete this.$options.sockets.typingStatus;
  },
  watch: {
    editMessage(editMessage) {
      if (!editMessage) {
        this.message = ""
      } else {
        this.message = emojiParser.emojiToShortcode(editMessage.message)
      }
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
    emojiIndex() {
      return this.$store.getters.getEmojiIndex;
    },
    recipients() {
      const selectedChannel = this.$store.getters.selectedChannelID;
      const channel = this.$store.getters.channels[selectedChannel];
      return channel ? channel.recipients : undefined;
    },
    userStatusColor() {
      const selectedChannel = this.$store.getters.selectedChannelID;
      const channel = this.$store.getters.channels[selectedChannel];
      const presences = this.$store.getters['members/presences'];

      let status = 0;
      if (!channel || !channel.recipients || !channel.recipients.length) {
        status = 0;
      } else if (
        this.$store.getters.user.friends[channel.recipients[0].uniqueID]
      ) {
        status = presences[channel.recipients[0].uniqueID] || 0;
      }
      return statuses[status].color;
    },
    editMessage() {
      let editMessage = this.$store.getters.popouts.editMessage;
      if (!editMessage) return null;
      return editMessage;
    }
  }
};
</script>



<style scoped>
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
}
.no-channel-selected .message {
  margin-top: 20px;
  text-align: center;
}
.no-channel-selected .material-icons {
  font-size: 50px;
}
.channel-selected {
  display: flex;
  width: 100%;
  align-items: center;
  height: 100%;
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
  background-color: rgba(0, 0, 0, 0.507);
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}
.message-logs {
  overflow: auto;
  flex: 1;
}
.message-logs,
.message-logs .scroll {
  transform: scale(1, -1) translate3d(0,0,0);
  margin-right: 5px;
}

.loading {
  overflow: auto;
  flex: 1;
}
.chat-input-area {
  display: flex;
  flex-direction: column;
  padding-top: 5px;
  margin-bottom: 5px;
  position: relative;
}

.attachment-button {
  width: 50px;
  background: rgba(0, 0, 0, 0.219);
  margin-right: 2px;
  margin-left: 10px;
  display: flex;
  flex-shrink: 0;
  cursor: default;
  user-select: none;
  transition: 0.3s;
  border-radius: 5px;
}
.attachment-button:hover {
  background: rgba(0, 0, 0, 0.322);
}
.attachment-button .material-icons {
  color: white;
  margin: auto;
}
.chat-input-area .info {
  color: rgba(255, 255, 255, 0.466);
  font-size: 12px;
  margin-left: 25px;
  margin-top: 5px;
  display: flex;
}
.typing-outer {
  flex: 1;
  height: 20px;
}
.message-count {
  float: right;
  margin-right: 20px;
  margin-top: 3px;
}
.message-area {
  display: flex;
  width: 100%;
}

.chat-input {
  font-family: "Roboto", sans-serif;
  background: rgba(0, 0, 0, 0.158);
  color: white;
  width: 100%;
  min-height: 20px;
  padding: 10px;
  margin: auto;
  font-size: 15px;
  resize: none;
  border: none;
  outline: none;
  transition: 0.3s;
  height: 1em;
  overflow: hidden;
  max-height: 30vh;
  overflow-y: auto;
  border-radius: 5px;
}

.chat-input:hover {
  background: rgba(0, 0, 0, 0.288);
}

.chat-input:focus {
  background: rgba(0, 0, 0, 0.466);
}

.send-button {
  font-size: 20px;
  color: white;
  background: rgba(0, 0, 0, 0.274);
  border: none;
  outline: none;
  margin-left: 2px;
  margin-right: 10px;
  min-height: 40px;
  width: 50px;
  transition: 0.3s;
  display: flex;
  flex-shrink: 0;
  border-radius: 5px;
  user-select: none;
}
.send-button .material-icons {
  margin: auto;
}
.send-button:hover {
  background: rgba(0, 0, 0, 0.514);
}
.error-send-button {
  background-color: rgba(255, 0, 0, 0.294);
}

.error-send-button:hover {
  background-color: rgba(255, 0, 0, 0.294);
}
.emojis-button {
  font-size: 20px;
  color: white;
  background: rgba(0, 0, 0, 0.274);
  border: none;
  outline: none;
  margin-left: 2px;

  min-height: 40px;
  width: 50px;
  transition: 0.3s;
  display: flex;
  flex-shrink: 0;
  border-radius: 5px;
  user-select: none;
}

.emojis-button .material-icons {
  margin: auto;
}
.emojis-button:hover {
  background: rgba(0, 0, 0, 0.514);
}
</style>
