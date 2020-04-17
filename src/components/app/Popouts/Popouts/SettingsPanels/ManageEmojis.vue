<template>
  <div class="manage-emoji-panel">
    <div class="info">
      <div class="title">
        Upload your own pretty emojis for free! Emojis must be 3MB or less.
        (png, jpg, gif)
      </div>
      <div class="button" @click="addEmojiBtn">
        <i class="material-icons">add_box</i>Add Emoji
      </div>
    </div>

    <div class="emojis-list">
      <div v-for="emoji in customEmojis" :key="emoji.emojiID" class="emoji">
        <img class="preview" :src="`${domain}${emoji.emojiID}.${emoji.gif ? 'gif' : 'png'}`" />
        <div class="emoji-name">
          <input
            type="text"
            :value="emoji.name"
            @keydown="keyDownEvent"
            @blur="blurEvent(emoji.emojiID, $event)"
          />
        </div>
        <div class="delete-button" @click="removeEmoji(emoji.emojiID)">
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
    />
  </div>
</template>

<script>
import customEmoji from "@/services/customEmoji.js";
import config from "@/config.js";
import path from "path";
import { mapState } from "vuex";
import emojiParser from "@/utils/emojiParser.js";

export default {
  components: {},
  data() {
    return {
      domain: config.nertiviaCDN + "/emojis/"
    };
  },
  methods: {
    errorBox(msg) {
      return this.$store.dispatch("setGenericMessage", msg);
    },
    keyDownEvent(event) {
      const keyCode = event.keyCode;
      if (keyCode == 13) {
        event.target.blur();
      }
    },
    async blurEvent(emojiID, event) {
      // send put request
      const { ok } = await customEmoji.put({
        emojiID,
        name: event.target.value
      });
      if (!ok) {
        this.errorBox("Something weng wrong. Try again later.");
        return;
      }
    },
    async emojiBrowse(event) {
      const file = event.target.files[0];
      event.target.value = "";
      const allowedFormats = [".png", ".jpeg", ".gif", ".jpg"];
      if (!allowedFormats.includes(path.extname(file.name).toLowerCase())) {
        this.errorBox("Upload failed - Unsupported image file.");
        return;
      } else if (file.size >= 3048576) {
        // 3048576 = 3mb
        this.errorBox(
          "Upload failed - Image size must be less than 1 megabytes."
        );
        return;
      }

      let reader = new FileReader();
      reader.readAsDataURL(file);
      const _this = this;
      reader.onload = async function() {
        //check if emoji name is already used by twemoji
        const fileName = path.basename(file.name, path.extname(file.name));

        const emojiExists = emojiParser.allEmojis.find(e =>
          e.shortcodes.find(ee => ee === fileName.toLowerCase())
        );

        let finalEmojiName = () => {
          if (emojiExists) {
            return `${fileName.substring(0, 28)}-1`;
          } else {
            return fileName.substring(0, 30);
          }
        };

        const { ok, error } = await customEmoji.post({
          name: finalEmojiName(),
          avatar: reader.result
        });
        if (!ok) {
          if (error.response && error.response.data) {
            _this.errorBox(error.response.data.message);
          } else {
            _this.errorBox("Something went wrong. Try again later.");
          }
          return;
        }
      };
      reader.onerror = function(error) {
        console.log("Error: ", error);
        _this.errorBox("Something went wrong. Try again later.");
      };
    },
    addEmojiBtn() {
      this.$refs.emojiBrowser.click();
    },
    async removeEmoji(emojiID) {
      const { ok } = await customEmoji.delete(emojiID);
      if (!ok) {
        this.errorBox("Something weng wrong. Try again later.");
        return;
      }
    }
  },
  computed: {
    ...mapState("settingsModule", ["GDriveLinked"]),
    customEmojis() {
      const customEmojis = [...this.$store.state.settingsModule.customEmojis];
      return customEmojis ? customEmojis.reverse() : [];
    }
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
  background: rgba(0, 0, 0, 0.2);
}
input:focus {
  background: rgba(0, 0, 0, 0.5);
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
  cursor: pointer;
  color: rgb(185, 185, 185);
  transition: 0.2s;
}
.delete-button:hover {
  color: white;
}
.delete-button .material-icons {
  margin: auto;
  margin-right: 10px;
  z-index: 999;
}

.preview {
  margin-left: 10px;
  margin-right: 10px;
  object-fit: contain;
  height: 2em;
  width: 2em;
  vertical-align: -9px;
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
  overflow: hidden;
}

.emojis-list {
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  width: calc(100% - 30px);
  margin: auto;
  margin-top: 5px;
}

.emoji {
  height: 50px;
  display: flex;
  width: 100%;
  align-items: center;
  transition: 0.3s;
  user-select: none;
  cursor: default;
  flex-shrink: 0;
}
.emoji:hover {
  background: rgba(0, 0, 0, 0.2);
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
  background: rgba(6, 52, 67, 0.4);
  margin-bottom: 10px;
  margin-left: 20px;
  user-select: none;
  transition: 0.3s;
  cursor: pointer;
  border-radius: 4px;
}
.button:hover {
  background: rgba(6, 52, 67, 0.6);
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
