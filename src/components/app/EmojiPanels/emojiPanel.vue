<template>
  <div v-click-outside="closePanel" class="emoji-panel">
    <div class="emoji-panel-inner">
      <div class="emojis-list">
        <!-- Recent Emojis Category  -->
        <div class="category">
          <div class="category-name">Recent</div>
          <div class="list">
            <div
              v-for="(recentEmoji, index) in this.recentEmojisList"
              :key="index"
              class="emoji-item"
              @click="emojiClickEvent(recentEmoji)"
            >
              <img
                v-lazyload
                class="panel emoji"
                :data-url="
                  getCustomEmoji(recentEmoji) ||
                    emojiShortcodeToPath(':' + recentEmoji + ':')
                "
              />
            </div>
          </div>
        </div>

        <!-- Custom Emojis Category  -->
        <div class="category">
          <div class="category-name">Custom Emojis</div>
          <div class="list">
            <div
              v-for="(customEmoji, index) in this.customEmojisList"
              :key="index"
              class="emoji-item"
              @click="customEmojiClickEvent(customEmoji)"
            >
              <img
                v-lazyload
                class="panel emoji"
                :data-url="customEmojiPath + customEmoji.emojiID"
              />
            </div>
          </div>
        </div>

        <!-- Custom Emojis Category  -->
        <div v-for="(group, index) in groups" :key="group" class="category">
          <div class="category-name">{{ group }}</div>
          <div class="list">
            <div
              v-for="emojiSorted in emojiByGroup(index)"
              :key="emojiSorted.shortcodes[0]"
              class="emoji-item"
              @click="emojiClickEvent(emojiSorted.shortcodes[0])"
            >
              <img
                v-lazyload
                class="panel emoji"
                :data-url="parseEmojiPath(emojiSorted.unicode)"
              />
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
          v-for="(emoji, index) in groupUnicodes"
          :key="index"
          class="tab"
          @mouseenter="mouseHover(emoji, $event)"
          @click="scrollToCategory(index + 2)"
        >
          <img class="panel-emoji" :src="selectRandom(emoji)" />
          <div class="tooltip">{{ groups[index] }}</div>
        </div>
      </div>
    </div>
    <div class="triangle" />
  </div>
</template>

<script>
import { bus } from "@/main";
import emojiParser from "@/utils/emojiParser.js";
import lazyLoad from "@/directives/LazyLoad.js";
import { mapState } from "vuex";
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
      customEmojisList: null,
      customEmojiPath: config.domain + "/media/"
    };
  },
  beforeMount() {
    this.recentEmojisList = this.recentEmojis;
    this.customEmojisList = this.customEmojis;
  },
  methods: {
    getCustomEmoji(shortCode) {
      const customEmoji = emojiParser.getCustomEmojisByShortCode(shortCode);
      return customEmoji
        ? this.customEmojiPath + customEmoji.emojiID
        : undefined;
    },
    closePanel(event) {
      if (!event.target.closest(".emojis-button")) this.$emit("close");
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
  computed: {
    ...mapState("settingsModule", ["recentEmojis", "customEmojis"])
  }
};
</script>

<style scoped>
.emoji-panel {
  position: absolute;
  bottom: -50px;
  right: 20px;
  max-width: 410px;
  width: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  z-index: 99999;
}

.emoji-panel-inner {
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  border-radius: 4px;
  transition: 0.3s;
  z-index: 99999;
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
  padding: 5px;
  padding-left: 3px;
  text-transform: capitalize;
  color: rgb(195, 195, 195);
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
  min-width: 30px;
  cursor: pointer;
  border-radius: 4px;
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
  transition: 0.3s;
  overflow: auto;
}
.tabs img {
  height: 18px;
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
  margin-left: 3px;
  margin-right: 3px;
  display: flex;
  flex-direction: column;
  transition: 0.1s;
  height: 35px;
  width: 35px;
  overflow: hidden;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  border-radius: 4px;
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
  border-top: 15px solid #000000ad;

  align-self: flex-end;
  margin-right: 46px;
}
.tooltip {
  display: none;
  position: absolute;
  margin: auto;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  padding: 5px;
  border-radius: 4px;
  bottom: -30px;
  text-transform: capitalize;
  user-select: none;
}

::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
</style>
<style>
img.panel.emoji {
  margin: auto;
  padding: 2px;
  object-fit: contain;
  height: 1.6em;
  width: 1.6em;
}
</style>
