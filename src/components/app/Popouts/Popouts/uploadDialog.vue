<template>
  <div class="dark-background">
    <div class="inner">
      <div class="info">
        <div
          v-show="image"
          ref="preview-image"
          class="preview-image"
        />
        <div
          v-if="!image"
          class="file-icon"
        >
          <i class="material-icons">insert_drive_file</i>
        </div>
        <div class="data">
          <div class="name">
            <strong>Name:</strong>
            {{ name }}
          </div>
          <div class="size">
            <strong>Size:</strong>
            {{ size }}
          </div>
        </div>
      </div>
      <div class="message">
        Add a message
      </div>
      <div class="message-area">
        <textarea
          v-model="message"
          class="chat-input"
          placeholder
        />
      </div>
      <div class="bottom-panel">
        <div
          class="close-button button"
          @click="closeButton"
        >
          <i class="material-icons">close</i>
          <div class="text">
            Cancel
          </div>
        </div>
        <div
          class="send-button button"
          @click="send"
        >
          <i class="material-icons">send</i>
          <div class="text">
            Send
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import filesize from "filesize";
import emojiParser from "@/utils/emojiParser.js";
import messagesService from "@/services/messagesService";
import { bus } from "@/main";
import {mapState} from 'vuex';
export default {
  props: ["file"],
  data() {
    return {
      message: "",
      name: "",
      size: "",
      image: false
    };
  },
  beforeMount() {
    if (this.popouts.fileToUpload.size == 0) {
      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: false
      });
    }
    if (!this.GDriveLinked) {
      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: false
      });
      this.$store.dispatch("setPopoutVisibility", {
        name: "GDLinkMenu",
        visibility: true
      });
    }
  },
  mounted() {
    (this.name = this.popouts.fileToUpload.name),
      (this.size = filesize(this.popouts.fileToUpload.size)),
      this.loadFileInfo(this.popouts.fileToUpload);
    document.addEventListener("keydown", this.keyDownEvent);
  },
  destroyed() {
    document.removeEventListener("keydown", this.keyDownEvent);
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
    closeButton() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: false
      });
    },
    loadFileInfo(file) {
      const previewImage = this.$refs["preview-image"];
      const mimeType = file.type;
      if (mimeType.split("/")[0] === "image") {
        this.image = true;
        const reader = new FileReader();
        reader.onloadend = function() {
          previewImage.style.backgroundImage = `url(${reader.result})`;
        };
        reader.readAsDataURL(file);
      }
    },
    async send() {
      const tempID = this.generateNum(25);
      const formData = new FormData();
      formData.append("message", emojiParser.replaceShortcode(this.message));
      formData.append("avatar", this.popouts.fileToUpload);
      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: false
      });
      this.$store.dispatch("addUpload", {
        channelID: this.selectedChannelID,
        tempID,
        name: this.popouts.fileToUpload.name,
        size: filesize(this.popouts.fileToUpload.size),
        percent: 0,
        created: new Date()
      });

      const { ok, error, result } = await messagesService.post(
        this.selectedChannelID,
        formData,
        percent => {
          this.$store.dispatch("updatePercentUpload", {
            tempID,
            percent
          });
        }
      );
      if (ok) {
        this.$store.dispatch("removeUpload", tempID);
      }

      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: false
      });
    },
    keyDownEvent(event) {
      const keyCode = event.keyCode;
      if (keyCode == 13) {
        return this.send();
      }
      if (keyCode == 27) {
        return this.$store.dispatch("setPopoutVisibility", {
          name: "uploadDialog",
          visibility: false
        });
      }
    }
  },
  computed: {
    ...mapState('settingsModule', ['GDriveLinked']),
    selectedChannelID() {
      return this.$store.getters.selectedChannelID;
    },

    popouts() {
      return this.$store.getters.popouts;
    }
  }
};
</script>

<style scoped>
.dark-background {
  background: rgba(0, 0, 0, 0.877);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  display: flex;
}
.inner {
  background: rgba(47, 47, 47, 0.938);
  display: flex;
  margin: auto;
  width: 500px;
  flex-direction: column;
  position: relative;
}
.info {
  display: flex;
  margin: 20px;
  font-size: 15px;
  margin-bottom: 40px;
}
.size {
  color: grey;
  margin-top: 5px;
}
.data {
  margin-left: 10px;
  color: white;
  margin-top: 5px;
}
.preview-image {
  background-color: #343434;
  height: 100px;
  width: 179px;
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
  border-radius: 4px;
  flex-shrink: 0;
}
.file-icon {
  height: 50px;
  width: 50px;
  flex-shrink: 0;
  display: flex;
}
.file-icon .material-icons {
  color: white;
  margin: auto;
  font-size: 50px;
}
.bottom-panel {
  margin-top: 10px;
  margin-bottom: 10px;
  color: white;
  bottom: 20px;
  display: flex;
  float: right;
  align-items: flex-end;
  align-content: flex-end;
  align-self: flex-end;
}

.button {
  margin: auto;
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
  align-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.267);
  padding: 5px;
  border-radius: 3px;
  cursor: default;
  user-select: none;
  transition: 0.3s;
}
.button:hover {
  background: rgba(0, 0, 0, 0.445);
}
.button .text {
  margin-left: 5px;
}
.close-button {
  padding-right: 10px;
}
.message {
  color: rgb(235, 235, 235);
  margin-left: 15px;
  margin-bottom: 5px;
}
.message-area {
  margin-left: 10px;
  margin-right: 10px;
  display: flex;
}
.chat-input {
  font-family: "Roboto", sans-serif;
  background: rgb(26, 26, 26);
  color: white;
  width: 100%;
  height: 20px;
  padding: 10px;
  margin: auto;
  font-size: 15px;
  resize: none;
  border: none;
  outline: none;
  transition: 0.3s;
}
@media (max-width: 518px) {
  .inner {
    align-content: center;
    align-items: center;
    align-self: center;
  }
  .info {
    flex-direction:column;
    margin-bottom: 20px;
    align-content: center;
    align-items: center;
    align-self: center;
  }
  .data{
    display: flex;
    flex-direction:column;
    align-content: center;
    align-items: center;
    align-self: center;
    text-align: center;
  }
  .bottom-panel {
    align-content: center;
    align-items: center;
    align-self: center;
  }
  .message-area {
    width: calc(100% - 20px);
  }
}
</style>

