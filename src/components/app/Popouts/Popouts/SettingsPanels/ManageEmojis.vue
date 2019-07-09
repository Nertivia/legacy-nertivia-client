<template>
  <div class="manage-emoji-panel">
    <div class="info">
      <div
        class="title"
      >
        Upload your own pretty emojis for free! Emojis must be 1MB or less. (png, jpg, gif)
      </div>
      <div
        class="button"
        @click="addEmojiBtn"
      >
        <i class="material-icons">add_box</i>Add Emoji
      </div>
    </div>

    <div class="emojis-list">
      <div
        v-for="emoji in customEmojis"
        :key="emoji.emojiID"
        class="emoji"
      >
        <img
          class="preview"
          :src="`${domain}${emoji.emojiID}`"
        >
        <div class="emoji-name">
          <input
            type="text"
            :value="emoji.name"
            @keydown="keyDownEvent"
            @blur="blurEvent(emoji.emojiID, $event)"
          >
        </div>
        <div
          class="delete-button"
          @click="removeEmoji(emoji.emojiID)"
        >
          <div class="material-icons">
            close
          </div>
          <div class="inner" />
        </div>
      </div>
    </div>
    <input
      ref="emojiBrowser"
      type="file"
      accept="image/*"
      class="hidden"
      @change="emojiBrowse"
    >
    <!-- <div class="option" @click="changePassword">Change Password</div> -->

    <div
      v-if="alert.show"
      class="alert-outer"
    >
      <div class="alert">
        <div class="alert-title">
          Error
        </div>
        <div class="alert-content">
          {{ alert.content }}
        </div>
        <div class="alert-buttons">
          <div
            class="alert-button"
            @click="alert.show = false"
          >
            Okay
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import customEmoji from "@/services/customEmoji.js";
import config from "@/config.js";
import { bus } from "@/main";
import path from "path";
import { mapState } from "vuex";
import emojiParser from "@/utils/emojiParser.js";

export default {
  components: {},
  data() {
    return {
      alert: {
        content: "",
        show: false
      },
      domain: config.domain + "/files/"
    };
  },
  methods: {
    keyDownEvent(event) {
      const keyCode = event.keyCode;
      if (keyCode == 13) {
        event.target.blur();
      }
    },
    async blurEvent(emojiID, event) {
      // send put request
      const { ok, error, result } = await customEmoji.put({emojiID, name: event.target.value});
      if (!ok) {
        this.alert.content =
          "Upload failed - " + error.response.data.message ||
          "Something weng wrong. Try again later.";
        return (this.alert.show = true);
      }
    },
    onProgress(percent) {
      //update vue
      console.log("emoji upload progress: ", percent);
    },
    async emojiBrowse(event) {
      const file = event.target.files[0];
      event.target.value = "";
      const allowedFormats = [".png", ".jpeg", ".gif", ".jpg"];
      if (!allowedFormats.includes(path.extname(file.name).toLowerCase())) {
        this.alert.content = "Upload failed - Unsupported image file.";
        return (this.alert.show = true);
      } else if (file.size >= 1048576) {
        // 1048576 = 1mb
        this.alert.content =
          "Upload failed - Image size must be less than 1 megabytes.";
        return (this.alert.show = true);
      }
      const formData = new FormData();
      //check if emoji name is already used by twemoji
      const fileName = path.basename(file.name, path.extname(file.name));

      const emojiExists = emojiParser.allEmojis.find(e =>
        e.shortcodes.find(ee => ee === fileName.toLowerCase())
      );
      if (emojiExists) {
        formData.append(
          "emoji",
          file,
          `${fileName.substring(0, 28)}-1${path.extname(file.name)}`
        );
      } else {
        formData.append(
          "emoji",
          file,
          `${fileName.substring(0, 30)}${path.extname(file.name)}`
        );
      }
      const { ok, error, result } = await customEmoji.post(
        formData,
        this.onProgress
      );
      if (!ok) {
        this.alert.content =
          "Upload failed - " + error.response.data.message ||
          "Something weng wrong. Try again later.";
        return (this.alert.show = true);
      }
    },
    addEmojiBtn() {
      if (!this.GDriveLinked) {
        return this.$store.dispatch("setPopoutVisibility", {
          name: "GDLinkMenu",
          visibility: true
        });
      }
      this.$refs.emojiBrowser.click();
    },
    async removeEmoji(emojiID) {

      const { ok, error, result } = await customEmoji.delete(emojiID);
      if (!ok) {
        this.alert.content =
          "Upload failed - " + error.response.data.message ||
          "Something weng wrong. Try again later.";
        return (this.alert.show = true);
      }
    }
  },
  computed: {
    ...mapState("settingsModule", ["GDriveLinked", "customEmojis"])
  }
};
</script>


<style scoped>
input {
  margin-top: 0;
  margin-bottom: 0;
  background: none;
  width: calc(100% - 30px);
}
input:hover {
  background: rgba(26, 26, 26, 0.24);
}
input:focus {
  background: rgba(26, 26, 26, 0.527);
}

.delete-button {
  display: flex;
  align-items: right;
  align-content: right;
  padding-right: 0px;
  padding-left: 0px;
  height: 100%;
  width: 50px;
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}
.delete-button .material-icons {
  margin: auto;
  margin-right: 10px;
  z-index: 999;
}

.delete-button:hover > .inner {
  width: 100%;
}

.delete-button .inner {
  background: rgba(255, 0, 0, 0.205);
  position: absolute;
  height: 100%;
  width: 0%;
  right: 0;
  transition: 0.3s;
  border-top-left-radius: 60px;
  border-bottom-left-radius: 60px;
}

.preview {
  height: 30px;
  width: auto;
  margin-left: 10px;
  margin-right: 10px;
}
.title {
  margin: 10px;
}
.manage-emoji-panel {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin-bottom: 20px;
}

.emojis-list {
  display: flex;
  flex-direction: column;
  background: rgba(47, 47, 47, 0.767);
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  width: calc(100% - 30px);
  margin: auto;
  margin-top: 5px;
}

.emoji {
  background: rgba(63, 63, 63, 0.411);
  height: 50px;
  width: calc(100% - 10px);
  display: flex;
  margin: 5px;
  align-items: center;
  transition: 0.3s;
  user-select: none;
  cursor: default;
  flex-shrink: 0;
}
.emoji:hover {
  background: rgba(75, 75, 75, 0.712);
}
.emoji-name {
  margin: auto;
  margin-left: 5px;
  flex: 1;
}
.button {
  display: inline-block;
  width: inherit;
  padding: 10px;
  border-radius: 5px;
  background: rgba(54, 54, 54, 0.603);
  margin-bottom: 10px;
  margin-left: 20px;
  user-select: none;
  transition: 0.3s;
}
.button:hover {
  background: rgb(54, 54, 54);
}
.button .material-icons {
  vertical-align: -6px;
  margin-right: 5px;
}

.hidden {
  display: none;
}

.alert-title {
  background: rgb(34, 34, 34);
  font-size: 20px;
  color: white;
  padding: 10px;
}
.alert-outer {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  background: rgba(0, 0, 0, 0.267);
}
.alert {
  margin: auto;
  background: rgb(49, 49, 49);
  width: 500px;
  box-shadow: 0px 0px 30px #000000;
  display: flex;
  flex-direction: column;
  user-select: none;
  cursor: default;
}
.alert-content {
  margin: auto;
  font-size: 16px;
  color: white;
  padding: 10px;
  padding-top: 30px;
  padding-bottom: 40px;
}
.alert-buttons {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}
.alert-button {
  color: white;
  margin: auto;
  background: rgba(73, 53, 53, 0.712);
  padding: 10px;
  transition: 0.3s;
}
.alert-button:hover {
  background: rgb(83, 53, 53);
}
</style>
