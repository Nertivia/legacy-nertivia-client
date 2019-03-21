<template>
  <div class="emoji-panel" v-click-outside="closePanel">
    <div class="emoji-panel-inner">
      <div class="emojis-list">
        <div class="category" v-for="(group, index) in groups" :key="group">
          <div class="category-name">{{group.split('-')[0]}}</div>
          <div class="list">
            <div
              class="emoji-item"
              v-for="emojiSorted in emojiByGroup(index)"
              :key="emojiSorted.shortcodes[0]"
              @click="clickEvent(emojiSorted.shortcodes[0])"
            >
              <img class="panel emoji" v-lazyload :data-url="parseEmojiPath(emojiSorted.unicode)">
            </div>
          </div>
        </div>
      </div>
      <div class="tabs">
        <div class="tab" v-for="(emoji, index) in groupUnicodes" :key="index" @mouseenter="mouseHover(emoji, $event)" >
          <img class="panel emoji" :src="selectRandom(emoji)" @click="scrollToCategory(index)">
        </div>
      </div>
    </div>
    <div class="triangle"></div>
  </div>
</template>

<script>
import { bus } from "@/main";
import emojiParser from "@/utils/emojiParser.js";
import lazyLoad from "@/directives/LazyLoad.js";

import emojis from "emojibase-data/en/compact.json";
import { groups } from "emojibase-data/meta/groups.json";

export default {
  directives: {
    lazyload: lazyLoad
  },
  data() {
    return {
      groupUnicodes: [
        ["😀", "😅", "☺️", "😇", "😉", "😍", "🥰", "😚", "😝", "😏", "😣", "😭", "🥺", "😢", "🤔", "😳", "😡", "🤤", "🤠", "🥳", "😦", "👅", "👀", "🙏", "👍", "👌", "👠"],
        ["🐱", "🐰", "🐷", "🐯", "🐸", "🐦", "🐧", "🐣", "🦋", "🐟", "🐿", "🌳", "🌴", "🌷", "🌹", "🌺", "🌻", "🌙", "🌍", "🌈", "🌦", "❄️", "💦", "☃️", "🔥", "💫", "☔️"],
        ["🍎", "🍌", "🍉", "🍇", "🍑", "🍒", "🍆", "🍕", "🍟", "🥞", "🍰", "🍪", "🍿", "🍩", "🥤", "🧁", "🍨", "🍭", "🥂", "🍹", "🍝", "🌮"],
        ["🏀", "🏈", "⚽️","🥏", "🎱", "🏓", "🏹", "🏆", "🥇", "🎨", "🎧", "🎹", "🎸", "🎮", "🎯", "🎳", "🏂"],
        ["🚗", "🚕", "🚑", "🚒", "🛵", "🚔", "🚁", "✈️", "⛵️", "🚦", "🗺", "🏝", "🏜", "🏔", "🏕", "🏥", "🎢", "⛩", "🏞", "🌄", "🌃", "🌌", "🌉", "🌇", "🎆"],
        ["⌚️", "📱", "💻", "🖥", "🖨", "💾", "📀", "💿", "📸", "⏰", "⌛️", "💸", "💵", "💴", "💶", "💷", "🔫", "🔪", "💎", "💳", "🧻", "🚽", "🛁", "🧼", "🛏", "🛋", "🧸", "🎉", "🎀", "🎁", "🛒", "✉️", "💌", "✏️", "📝", "🖌", "📚", "📊", "📆", "📁", "📋", "🔒", "📏", "📌", "✂️"],
        ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "💕", "💖", "💘", "💔", "🔞", "📵", "🚭", "⚠️", "🔆", "✅", "♻️", "🚸", "⁉️", "💢", "💯", "🚾", "🏧", "🌐", "🔡", "🆒", "🆕", "🆓", "🆗", "🎵", "♾", "™️", "©️", "💬", "📢", "♉️", "♒️", "🆚", "🆘", "📛", "🚫", "🚯", "🕓"],
        ["🏁", "🏴‍☠️", "🇦🇶", "🇧🇷", "🇨🇦", "🇯🇵", "🇵🇰", "🇵🇱", "🇹🇷", "🇺🇸", "🇬🇧", "🇰🇷", "🇫🇷", "🇩🇪", "🇯🇲", "🇳🇵", "🇬🇷", "🇷🇺", "🇪🇸", "🇩🇰", "🇨🇿", "🇮🇹", "🇮🇳", "🇨🇭"]
        ]
    };
  },
  methods: {
    closePanel() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "emojiPanel",
        visibility: false
      });
    },
    emojiByGroup(index) {
      index = parseInt(index);
      return emojis.filter(_emoji => _emoji.group === index);
    },
    parseEmojiPath(emoji) {
      return emojiParser.GetEmojiPath(emoji);
    },
    selectRandom(array){
      const randomNum = Math.floor((Math.random() * array.length));
      return this.parseEmojiPath(array[randomNum])
    },
    clickEvent(shortcode) {
      bus.$emit("emojiPanel:Selected", shortcode);
    },
    mouseHover(emoji, event){
      event.target.children[0].src = this.selectRandom(emoji)
    },
    scrollToCategory(index) {
      console.log("🏁 🏴‍☠️ 🇦🇶 🇧🇷 🇨🇦 🇯🇵 🇵🇰 🇵🇱  🇹🇷 🇺🇸 🇬🇧 🇰🇷 🇫🇷 🇩🇪 🇯🇲  🇳🇵 🇬🇷 🇷🇺 🇪🇸 🇩🇰 🇨🇿 🇮🇹 🇮🇳 🇨🇭".split(" "))
      const elements = document.querySelectorAll(".category-name");
      elements[index].scrollIntoView();
    }
  },
  computed: {
    groups() {
      return groups;
    }
  }
};
</script>


<style scoped>
.emoji-panel {
  position: absolute;
  bottom: 10px;
  right: 20px;
  width: 390px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 99999;
}

.emoji-panel-inner {
  background: rgba(255, 255, 255, 0.61);
  transition: 0.3s;
  border-radius: 5px;
  padding: 3px;
  z-index: 99999;
}
.emoji-panel-inner:hover {
  background: rgba(255, 255, 255, 0.781)
}
.emojis-list {
  color: white;
  padding: 5px;
  user-select: none;
  cursor: default;
  height: 300px;
  overflow-y: auto;
  transition: 0.32s;
  z-index: 99999;
  margin-left: 10px;
}

.category {
}
.category-name {
  padding: 10px;
  text-transform:capitalize;
  color: rgb(143, 143, 143);
}
.list {
}
.emoji-item {
  background: rgba(59, 59, 59, 0.521);
  transition: 0.3s;
  display: inline-flex;
  flex-direction: column;
  overflow: hidden;
  margin: 4px;
  padding: 2px;
  border-radius: 5px;
  height: 30px;
  width: 30px;
}
.emoji-item:hover {
  background: rgb(59, 59, 59);
}
.tabs {
  display: flex;
  color: white;
  align-content: center;
  align-items: center;
  align-self: center;
  justify-content: center;
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 10px;
  background: rgb(161, 161, 161);
  border-radius: 5px;
  transition: 0.3s;
}
.tabs img {
  height: 20px;
  width: 20px;
  margin: auto;
  padding-right: 3px;
  filter: grayscale(100%);
  transition: 0.1s;
}
.tab {
  background: rgba(59, 59, 59, 0.521);
  border-radius: 5px;
  margin-left: 7px;
  margin-right: 7px;
  display: flex;
  flex-direction: column;
  transition: 0.3s;
  height: 35px;
  width: 325px;
  overflow: hidden;
}
.tab:hover {
  background: rgba(73, 73, 73, 0.733);
}
.tab:hover img {
  height: 29px;
  width: 29px;
  margin: auto;
  padding-left: 2px;
  filter: grayscale(0)
}
.triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid rgba(32, 32, 32, 0.87);

  align-self: flex-end;
  margin-right: 70px;
}
</style>
<style>
img.panel.emoji {
  margin-left: 3px;
  margin-top: 3px;
  margin: auto;
}
</style>
