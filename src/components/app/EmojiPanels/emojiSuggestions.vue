<template>
  <div class="emoji-suggetions-list">
    <div
      v-for="(emoji, i) in $props.emojiArray"
      :key="emoji.hexcode || emoji.emojiID"
      :class="{ emojiItem: true, selected: i === index }"
      @mouseenter="hoverEvent"
      @click="clickEvent"
    >
      <div class="preview">
        <span v-if="emoji.unicode" v-html="emojiParser(emoji.unicode)" />
        <span v-else>
          <img
            class="emoji"
            :src="
              `${customEmojiPath + emoji.emojiID}.${emoji.gif ? 'gif' : 'png'}`
            "
          />
        </span>
      </div>
      <div class="short-code">:{{ emoji.name || emoji.shortcodes[0] }}:</div>
    </div>
  </div>
</template>

<script>
import emojiParser from "@/utils/emojiParser.js";
import config from "@/config.js";
export default {
  props: ["emojiArray"],
  data() {
    return {
      customEmojiPath: config.nertiviaCDN + "emojis/",
      index: 0
    };
  },
  watch: {
    emojiArray() {
      this.index = 0;
    }
  },
  methods: {
    emojiParser(emoji) {
      return emojiParser.replaceEmojis(emoji);
    },
    hoverEvent(event) {
      const emoji = event.target.closest(".emojiItem");
      const parent = event.target.parentElement.children;
      if (!emoji) return;
      const index = [...parent].findIndex(el => el === emoji);
      if (index >= 0) this.index = index;
    },
    KeySwitch(key) {
      if (key == "up") {
        if (this.index == 0)
          return (this.index = this.$props.emojiArray.slice(0, 10).length - 1);

        this.index = this.index - 1;
      }
      if (key == "down") {
        if (this.index == this.$props.emojiArray.slice(0, 10).length - 1)
          return (this.index = 0);
        this.index = this.index + 1;
      }
    },
    clickEvent() {
      this.$emit("chosen");
    }
  }
};
</script>

<style scoped>
.selected {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}
.emoji-suggetions-list {
  position: absolute;
  bottom: -35px;
  left: 50px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 2;
  background: rgba(34, 34, 34, 0.8);
  box-shadow: 0px 0px 5px 1px rgb(0, 0, 0);
  backdrop-filter: blur(10px);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.3s;
  user-select: none;
  cursor: default;
}
.preview {
  margin-right: 5px;
}
.name {
  flex: 1;
}
.short-code {
  margin-right: 10px;
}
.emojiItem {
  display: flex;
  padding: 2px;
  align-content: center;
  align-items: center;
  cursor: pointer;
}
@media (max-height: 441px) {
  .emoji-suggetions-list {
    max-height: 150px;
  }
}
</style>

<style>
.emoji-suggetions-list img.emoji {
  object-fit: contain;
  height: 1.6em;
  width: 1.6em;
  margin: 1px;
}
</style>
