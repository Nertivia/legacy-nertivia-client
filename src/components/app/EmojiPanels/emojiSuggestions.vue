<template>
  <div class="emoji-suggetions-list">
    <div
      v-for="(emoji, index) in $props.emojiArray.slice(0,10)"
      :key="emoji.hexcode || emoji.emojiID"
      :class="{emojiItem: true, selected: index === emojiIndex}"
      @mouseenter="hoverEvent"
      @click="clickEvent"
    >
      <div class="preview">
        <span
          v-if="emoji.unicode"
          v-html="emojiParser(emoji.unicode)"
        />
        <span v-else>
          <img
            class="emoji"
            :src="customEmojiPath + emoji.emojiID"
          >
        </span>
      </div>
      <div class="short-code">
        :{{ emoji.name || emoji.shortcodes[0] }}:
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main";
import emojiParser from "@/utils/emojiParser.js";
import config from "@/config.js";
export default {
  props: ["emojiArray"],
  data(){
    return {
      customEmojiPath: config.domain + "/files/"
    }
  },
  computed: {
    emojiIndex() {
      return this.$store.getters.getEmojiIndex;
    }
  },
  watch: {
    emojiArray() {
      this.$store.dispatch("changeIndex", 0);
    }
  },
  mounted() {
    bus.$on("emojiSuggestions:key", this.KeySwitch);
  },
  destroyed() {
    bus.$off("emojiSuggestions:key", this.KeySwitch);
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
      if (index >= 0) this.$store.dispatch("changeIndex", index);
    },
    KeySwitch(key) {
      if (key == "up") {
        if (this.emojiIndex == 0)
          return this.$store.dispatch(
            "changeIndex",
            this.$props.emojiArray.slice(0, 10).length - 1
          );

        this.$store.dispatch("changeIndex", this.emojiIndex - 1);
      }
      if (key == "down") {
        if (this.emojiIndex == this.$props.emojiArray.slice(0, 10).length - 1)
          return this.$store.dispatch("changeIndex", 0);
        this.$store.dispatch("changeIndex", this.emojiIndex + 1);
      }
    },
    clickEvent() {
      bus.$emit('emojiSuggestions:Selected')
    }
  }
};
</script>


<style scoped>
.custom-emoji {
  height: 1.5em;
  width: auto;
}
.selected {
  background: rgba(66, 66, 66, 0.89);
}
.emoji-suggetions-list {
  position: absolute;
  bottom: 0;
  left: 70px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 2;

  background: rgba(32, 32, 32, 0.87);
  color: white;
  padding: 5px;
  transition: 0.3s;
  border-radius: 5px;
  user-select: none;
  cursor: default;
}
.emoji-suggetions-list:hover {
  background: rgba(32, 32, 32, 0.966);
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
  padding: 5px;
  align-content: center;
  align-items: center;
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
  height: 2em;
  width: 2em;
  margin: 1px;
}
</style>