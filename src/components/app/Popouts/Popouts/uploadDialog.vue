<template>
  <div class="dark-background upload-dialog-popout">
    <div class="inner exceed" v-if="exceededSize" v-click-outside="closeButton">
      <div class="material-icons icon">close</div>
      <div class="message">File size exceeded 50MB</div>
    </div>
    <div v-else class="inner">
      <div class="info">
        <div v-show="image" ref="preview-image" class="preview-image" />
        <div v-if="!image" class="file-icon">
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
          <div 
            v-if="image"
            class="checkbox" 
            :class="{selected: compress}"
            @click="toggleCompressButton">
            <div class="box" />
            <div class="name">Compress Image</div>
          </div>
        </div>
      </div>
      <div class="upload-cdn" v-if="image">
        <div class="title">Upload to:</div>
        <div
          class="radio"
          :class="{ selected: !upload_cdn }"
          @click="upload_cdn = 0"
        >
          <div class="box" />
          <div class="text">
            Google Drive <span class="notice">(Does not work sometimes.)</span>
          </div>
        </div>
        <div
          class="radio"
          :class="{ selected: upload_cdn }"
          @click="upload_cdn = 1"
        >
          <div class="box" />
          <div class="text">
            Nertivia CDN
            <span class="notice">(Data is not guaranteed to stay + Images only.)</span>
          </div>
        </div>
      </div>
      <div class="message-area">
        <textarea
          v-model="message"
          class="chat-input"
          placeholder="Add a message"
          ref="messageInput"
        />
      </div>
      <div class="bottom-panel">
        <div class="close-button button" @click="closeButton">
          <i class="material-icons">close</i>
          <div class="text">
            Cancel
          </div>
        </div>
        <div class="send-button button" @click="send">
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
import { mapState } from "vuex";
export default {
  props: ["file"],
  data() {
    return {
      exceededSize: false,
      message: "",
      name: "",
      size: "",
      image: false,
      upload_cdn: 0, // 0: google drive, 1: CDN
      compress: 1,
    };
  },
  beforeMount() {
    if (this.popouts.fileToUpload.size == 0) {
      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: false
      });
    }
  },
  mounted() {
    const maxSize =  52424000 //50MB
    if (this.popouts.fileToUpload.size > maxSize ) {
      this.exceededSize = true
      return;
    }
    this.$refs["messageInput"].focus();
    (this.name = this.popouts.fileToUpload.name),
      (this.size = filesize(this.popouts.fileToUpload.size)),
      this.loadFileInfo(this.popouts.fileToUpload);
    document.addEventListener("keydown", this.keyDownEvent);
  },
  destroyed() {
    document.removeEventListener("keydown", this.keyDownEvent);
  },
  watch: {
    upload_cdn() {
      const maxCDNSize = 7340000; 
        if (this.upload_cdn === 1 && this.popouts.fileToUpload.size > maxCDNSize) {
          this.compress = 1;
        }
    }
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
    toggleCompressButton() {
      const maxCDNSize = 7340000; 
      if (this.upload_cdn === 1 && this.compress === 1 &&  this.popouts.fileToUpload.size > maxCDNSize) {
        alert("Nertivia CDN Max file size: 7MB. \nEither compress the image or upload using Google Drive option.")
        return;
      }
      this.compress ? this.compress = 0 : this.compress = 1
    },
    loadFileInfo(file) {
      const previewImage = this.$refs["preview-image"];
      const mimeType = file.type;
      if (mimeType.split("/")[0] === "image") {
        this.upload_cdn = 1;
        this.image = true;
        const reader = new FileReader();
        reader.onloadend = function() {
          previewImage.style.backgroundImage = `url(${reader.result})`;
        };
        reader.readAsDataURL(file);
      }
    },
    async send() {

      if (this.upload_cdn === 0 && !this.GDriveLinked) {
        this.$store.dispatch("setPopoutVisibility", {
          name: "GDLinkMenu",
          visibility: true
        });
        return;
      }
      const tempID = this.generateNum(25);
      const formData = new FormData();
      if (this.message.length) {
        formData.append("message", emojiParser.replaceShortcode(this.message));
      }
      if (this.image) {
        formData.append("compress", this.compress);
      }
      formData.append("upload_cdn", this.upload_cdn);
      formData.append("file", this.popouts.fileToUpload);
      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: false
      });
      this.$store.dispatch("addUpload", {
        channelID: this.currentChannelID,
        tempID,
        name: this.popouts.fileToUpload.name,
        size: filesize(this.popouts.fileToUpload.size),
        percent: 0,
        created: new Date()
      });

      const { ok, error } = await messagesService.post(
        this.currentChannelID,
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
      } else {
        this.$store.dispatch("removeUpload", tempID);
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
            },
            message: message,
            messageID: Math.floor(Math.random() * 10999 + 0).toString(),
            color: "#ff4d4d",
            channelID: this.currentChannelID,
            created: new Date(),
          },
        });
      }

      this.$store.dispatch("setPopoutVisibility", {
        name: "uploadDialog",
        visibility: false
      });
    },
    keyDownEvent(event) {
      const keyCode = event.keyCode;
      if (keyCode == 13 && !event.shiftKey) {
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
    ...mapState("settingsModule", ["GDriveLinked"]),
    currentChannelID() {
      return this.$store.getters.currentChannelID;
    },
    popouts() {
      return this.$store.getters.popouts;
    }
  }
};
</script>

<style scoped lang="scss">
.dark-background {
  background: rgba(0, 0, 0, 0.4);
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999999;
  display: flex;
}
.inner {
  display: flex;
  margin: auto;
  width: 500px;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: linear-gradient(
    to bottom,
    rgba(0, 87, 153, 0.8) 0,
    rgba(0, 118, 209, 0.8)
  );
  border-radius: 4px;
  backdrop-filter: blur(5px);
}

.exceed  {
  height: 300px;
  width: 300px;
  align-content: center;
  align-items: center;
  justify-content: center;
  user-select: none;
  background: linear-gradient(
    to bottom,
    rgba(153, 5, 0, 0.8) 0,
    rgba(209, 31, 0, 0.8)
  );
  .icon {
    color: white;
    font-size: 70px;
    margin-bottom: 30px;
  }
}

.upload-cdn {
  color: white;
  margin-left: 10px;
  margin-bottom: 10px;
  .radio {
    color: rgba(255, 255, 255, 0.8);
    display: flex;
    align-content: center;
    align-items: center;
    height: 30px;
    cursor: pointer;
    user-select: none;
    transition: 0.2s;
    .notice {
      font-size: 14px;
      opacity: 0.8;
    }
    .box {
      height: 20px;
      width: 20px;
      background: rgba(255, 255, 255, 0.4);
      margin-right: 5px;
      border-radius: 50%;
      transition: 0.2s;
      flex-shrink: 0;
    }
    &:hover .box {
      background: rgba(255, 255, 255, 0.8);
    }
    &:hover {
      color: white;
    }
    &.selected {
      .box {
        background: white;
      }
      color: white;
    }
  }
}
.info {
  display: flex;
  margin: 20px;
  margin-left: 10px;
  font-size: 15px;
  margin-bottom: 10px;
}
.size {
  color: rgb(221, 221, 221);
  margin-top: 5px;
}
.data {
  margin-left: 10px;
  color: white;
  margin-top: 5px;
  .checkbox {
    display: flex;
    margin-top: 5px;
    transition: 0.2s;
    opacity: 0.7;
    user-select: none;
    cursor: pointer;
    &:hover {
      .box {
        background: rgba(255, 255, 255, 0.6);
      }
      opacity: 1;
    }
    &.selected {
      .box {
        background: white;
      }
      opacity: 1;
    }
    
    .box {
      height: 20px;
      width: 20px;
      margin-right: 5px;
      transition: 0.2s;
      background: rgba(255, 255, 255, 0.6);
      border-radius: 4px;
    }
  }
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
  background: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  padding: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  color: rgba(255, 255, 255, 0.8);
}
.button:hover {
  background: rgba(0, 0, 0, 0.4);
  color: white;
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
  font-family: "Montserrat", sans-serif;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
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
.chat-input::placeholder {
  color: rgb(221, 221, 221);
}
@media (max-width: 518px) {
  .inner {
    align-content: center;
    align-items: center;
    align-self: center;
  }
  .info {
    flex-direction: column;
    margin-bottom: 20px;
    align-content: center;
    align-items: center;
    align-self: center;
  }
  .data {
    display: flex;
    flex-direction: column;
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
