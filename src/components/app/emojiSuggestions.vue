<template>
  <div class="emoji-suggetions-list">
    <div
      v-for="(emoji, index) in $props.emojiArray.slice(0,10)"
      :class="{emoji: true, selected: index === selectedIndex}"
      @mouseover="hoverEvent"
      :key="emoji.hexcode"
    >
      <div class="preview" v-html="emojiParser(emoji.unicode)"></div>
      <div class="short-code">:{{emoji.shortcodes[0]}}:</div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main";
import emojiParser from "@/utils/emojiParser.js";
export default {
  props: ["emojiArray"],
  data() {
    return {
      selectedIndex: 0
    };
  },
  methods: {
    emojiParser(emoji) {
      return emojiParser.replaceEmojis(emoji);
    },
    hoverEvent(event) {
      const emoji = event.target.closest(".emoji");
      const parent = event.target.parentElement.children;
      if (!emoji || !emoji) return;
      const index = [...parent].findIndex(el => el === emoji);
      if (index >= 0) this.selectedIndex = index;
    },
    KeySwitch(key) {
      if (key == "up") {
        if (this.selectedIndex == 0)
          return (this.selectedIndex =
            this.$props.emojiArray.slice(0, 10).length - 1);

        this.selectedIndex--;
      }
      if (key == "down") {
        if (
          this.selectedIndex ==
          this.$props.emojiArray.slice(0, 10).length - 1
        )
          return (this.selectedIndex = 0);

        this.selectedIndex++;
      }
    },
  },
  mounted() {
    bus.$on("emojiSuggestions:up", () => this.KeySwitch("up"));
    bus.$on("emojiSuggestions:down", () => this.KeySwitch("down"));
  },
  watch: {
    emojiArray() {
      this.selectedIndex = 0;
    }
  }
};
</script>


<style scoped>
.selected {
  background: rgba(66, 66, 66, 0.89);
}
.emoji-suggetions-list {
  position: absolute;
  bottom: 0;
  left: 70px;
  max-height: 400px;
  overflow-y: auto;

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
.emoji {
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
