<template>
  <div class="emoji-panel" v-click-outside="closePanel">
    <div class="emoji-panel-inner">
      <div class="emojis-list">
        <!-- Recent Emojis Category  -->
        <div class="category">
          <div class="category-name">Recent</div>
          <div class="list">
            <div
              class="emoji-item"
              v-for="(recentEmoji, index) in this.recentEmojisList"
              :key="index"
              @click="emojiClickEvent(recentEmoji)"
            >
              <img
                class="panel emoji"
                v-lazyload
                :data-url=" getCustomEmoji(recentEmoji) || emojiShortcodeToPath(':' + recentEmoji + ':')"
              >
            </div>
          </div>
        </div>

        <!-- Custom Emojis Category  -->
        <div class="category">
          <div class="category-name">Custom Emojis</div>
          <div class="list">
            <div
              class="emoji-item"
              v-for="(customEmoji, index) in this.customEmojisList"
              :key="index"
              @click="customEmojiClickEvent(customEmoji)"
            >
              <img class="panel emoji" v-lazyload :data-url="customEmojiPath + customEmoji.emojiID">
            </div>
          </div>
        </div>

        <div class="category" v-for="(group, index) in groups" :key="group">
          <div class="category-name">{{group}}</div>
          <div class="list">
            <div
              class="emoji-item"
              v-for="emojiSorted in emojiByGroup(index)"
              :key="emojiSorted.shortcodes[0]"
              @click="emojiClickEvent(emojiSorted.shortcodes[0])"
            >
              <img class="panel emoji" v-lazyload :data-url="parseEmojiPath(emojiSorted.unicode)">
            </div>
          </div>
        </div>
      </div>
      <div class="tabs">
        <div class="tab" @click="scrollToCategory(0)">
          <i class="material-icons">history</i>
          <div class="tooltip">Recent</div>
        </div>
        <div class="tab" @click="scrollToCategory(1)">
          <i class="material-icons">face</i>
          <div class="tooltip">Custom Emojis</div>
        </div>
        <div
          class="tab"
          v-for="(emoji, index) in groupUnicodes"
          :key="index"
          @mouseenter="mouseHover(emoji, $event)"
          @click="scrollToCategory(index + 2)"
        >
          <img class="panel-emoji" :src="selectRandom(emoji)">
          <div class="tooltip">{{ groups[index]}}</div>
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
import {mapState} from 'vuex'
import config from "@/config.js";


export default {
  directives: {
    lazyload: lazyLoad
  },
  data() {
    return {
      groupUnicodes: [
        [
          "😀",
          "😅",
          "☺️",
          "😇",
          "😉",
          "😍",
          "🥰",
          "😚",
          "😝",
          "😏",
          "😣",
          "😭",
          "🥺",
          "😢",
          "🤔",
          "😳",
          "😡",
          "🤤",
          "🤠",
          "🥳",
          "😦",
          "👅",
          "👀",
          "🙏",
          "👍",
          "👌",
          "👠"
        ],
        [
          "🐱",
          "🐰",
          "🐷",
          "🐯",
          "🐸",
          "🐦",
          "🐧",
          "🐣",
          "🦋",
          "🐟",
          "🐿",
          "🌳",
          "🌴",
          "🌷",
          "🌹",
          "🌺",
          "🌻",
          "🌙",
          "🌍",
          "🌈",
          "🌦",
          "❄️",
          "💦",
          "☃️",
          "🔥",
          "💫",
          "☔️"
        ],
        [
          "🍎",
          "🍌",
          "🍉",
          "🍇",
          "🍑",
          "🍒",
          "🍆",
          "🍕",
          "🍟",
          "🥞",
          "🍰",
          "🍪",
          "🍿",
          "🍩",
          "🥤",
          "🧁",
          "🍨",
          "🍭",
          "🥂",
          "🍹",
          "🍝",
          "🌮"
        ],
        [
          "🏀",
          "🏈",
          "⚽️",
          "🥏",
          "🎱",
          "🏓",
          "🏹",
          "🏆",
          "🥇",
          "🎨",
          "🎧",
          "🎹",
          "🎸",
          "🎮",
          "🎯",
          "🎳",
          "🏂"
        ],
        [
          "🚗",
          "🚕",
          "🚑",
          "🚒",
          "🛵",
          "🚔",
          "🚁",
          "✈️",
          "⛵️",
          "🚦",
          "🗺",
          "🏝",
          "🏜",
          "🏔",
          "🏕",
          "🏥",
          "🎢",
          "⛩",
          "🏞",
          "🌄",
          "🌃",
          "🌌",
          "🌉",
          "🌇",
          "🎆"
        ],
        [
          "⌚️",
          "📱",
          "💻",
          "🖥",
          "🖨",
          "💾",
          "📀",
          "💿",
          "📸",
          "⏰",
          "⌛️",
          "💸",
          "💵",
          "💴",
          "💶",
          "💷",
          "🔫",
          "🔪",
          "💎",
          "💳",
          "🧻",
          "🚽",
          "🛁",
          "🧼",
          "🛏",
          "🛋",
          "🧸",
          "🎉",
          "🎀",
          "🎁",
          "🛒",
          "✉️",
          "💌",
          "✏️",
          "📝",
          "🖌",
          "📚",
          "📊",
          "📆",
          "📁",
          "📋",
          "🔒",
          "📏",
          "📌",
          "✂️"
        ],
        [
          "❤️",
          "🧡",
          "💛",
          "💚",
          "💙",
          "💜",
          "🖤",
          "💕",
          "💖",
          "💘",
          "💔",
          "🔞",
          "📵",
          "🚭",
          "⚠️",
          "🔆",
          "✅",
          "♻️",
          "🚸",
          "⁉️",
          "💢",
          "💯",
          "🚾",
          "🏧",
          "🌐",
          "🔡",
          "🆒",
          "🆕",
          "🆓",
          "🆗",
          "🎵",
          "♾",
          "™️",
          "©️",
          "💬",
          "📢",
          "♉️",
          "♒️",
          "🆚",
          "🆘",
          "📛",
          "🚫",
          "🚯",
          "🕓"
        ],
        [
          "🏁",
          "🏴‍☠️",
          "🇦🇶",
          "🇧🇷",
          "🇨🇦",
          "🇯🇵",
          "🇵🇰",
          "🇵🇱",
          "🇹🇷",
          "🇺🇸",
          "🇬🇧",
          "🇰🇷",
          "🇫🇷",
          "🇩🇪",
          "🇯🇲",
          "🇳🇵",
          "🇬🇷",
          "🇷🇺",
          "🇪🇸",
          "🇩🇰",
          "🇨🇿",
          "🇮🇹",
          "🇮🇳",
          "🇨🇭"
        ]
      ],
      emojis: emojiParser.allEmojis,
      groups: emojiParser.allGroups,
      recentEmojisList: null,
      customEmojisList : null,
      customEmojiPath: config.domain + "/files/"

    };
  },
  methods: {
    getCustomEmoji(shortCode){
      const customEmoji = emojiParser.getCustomEmojisByShortCode(shortCode)
      return (customEmoji ? this.customEmojiPath + customEmoji.emojiID : undefined)
    },
    closePanel() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "emojiPanel",
        visibility: false
      });
    },
    emojiByGroup(index) {
      index = parseInt(index);
      return this.emojis.filter(_emoji => _emoji.group === index);
    },
    parseEmojiPath(emoji) {
      return emojiParser.GetEmojiPath(emoji);
    },
    emojiShortcodeToPath(shortcode) {
      return this.parseEmojiPath(emojiParser.replaceShortcode(shortcode));
    },
    selectRandom(array) {
      const randomNum = Math.floor(Math.random() * array.length);
      return this.parseEmojiPath(array[randomNum]);
    },
    customEmojiClickEvent(emoji) {
      bus.$emit("emojiPanel:Selected", emoji.name);
    },
    emojiClickEvent(shortcode) {
      bus.$emit("emojiPanel:Selected", shortcode);
    },
    mouseHover(emoji, event) {
      event.target.children[0].src = this.selectRandom(emoji);
    },
    scrollToCategory(index) {
      const elements = document.querySelectorAll(".category-name");
      elements[index].scrollIntoView();
    }
  },
  beforeMount() {
    this.recentEmojisList = this.recentEmojis
    this.customEmojisList = this.customEmojis
  }, 
  computed: {
    ...mapState('settingsModule', ['recentEmojis', 'customEmojis'])
  }
};
</script>


<style scoped>
.emoji-panel {
  position: absolute;
  bottom: 10px;
  right: 20px;
  max-width: 390px;
  width: calc(100% - 50px);
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
  background: rgba(255, 255, 255, 0.685);
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
  text-transform: capitalize;
  color: rgb(93, 93, 93);
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
  min-width: 30px;
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
  padding-top: 5px;
  padding-bottom: 5px;
  margin-top: 10px;
  background: rgb(161, 161, 161);
  border-radius: 5px;
  transition: 0.3s;
  overflow: auto;
}
.tabs img {
  height: 20px;
  width: auto;
  margin: auto;
  filter: grayscale(100%);
  transition: 0.1s;
}
.tabs .material-icons {
  margin: auto;
  color: rgb(185, 185, 185);
  transition: 0.1s;
  user-select: none;
}
.tab {
  background: rgba(59, 59, 59, 0.521);
  border-radius: 5px;
  margin-left: 3px;
  margin-right: 3px;
  display: flex;
  flex-direction: column;
  transition: 0.1s;
  height: 35px;
  width: 32px;
  overflow: hidden;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tab:hover {
  background: rgb(73, 73, 73);
}
.tab:hover .tooltip {
  display: flex;
}
.tab:hover img {
  transform: scale(1.3);
  filter: grayscale(0);
}

.tab:hover .material-icons {
  transform: scale(1.3);
  color: white;
}

.triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid rgba(255, 255, 255, 0.61);

  align-self: flex-end;
  margin-right: 70px;
}
.tooltip {
  display: none;
  position: absolute;
  margin: auto;
  background: rgba(29, 29, 29, 0.664);
  padding: 10px;
  border-radius: 5px;
  bottom: -20px;
  text-transform: capitalize;
  user-select: none;
}
</style>
<style>
img.panel.emoji {
  margin-left: 3px;
  margin-top: 3px;
  margin: auto;
  width: auto;
}
</style>
