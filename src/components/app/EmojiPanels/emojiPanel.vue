<template>
  <div v-click-outside="closePanel" class="emoji-panel">
    <div class="emoji-panel-inner">
      <div class="emojis-list">
        <virtual-list :size="37" :remain="11" ref="virtualList">
          <div class="category">Recents</div>

          <div
            class="emoji-row"
            v-for="(e, i) in allRecentEmojis"
            :key="i + 'r'"
          >
            <div class="wrapper">
              <emoji-template
                v-for="(em, ind) in e"
                :key="ind"
                :emoji="em"
                @click.native="emojiClick(em)"
              />
            </div>
          </div>
          <div class="category">Custom Emojis</div>
          <div
            class="emoji-row"
            v-for="(e, i) in allCustomEmojis"
            :key="i + 'c'"
          >
            <div class="wrapper">
              <emoji-template
                v-for="(em, ind) in e"
                :key="ind"
                :emoji="em"
                @click.native="emojiClick(em)"
              />
            </div>
          </div>
          <div
            v-for="(e, i) in emojiWithGroup"
            :class="`${e.gname ? 'category' : 'emoji-row'}`"
            :key="i"
          >
            <div class="name" v-if="e.gname">{{ e.gname }}</div>
            <div class="wrapper" v-if="!e.gname">
              <emoji-template
                v-for="(em, ind) in e"
                :key="ind"
                :emoji="em"
                @click.native="emojiClick(em)"
              />
            </div>
          </div>
        </virtual-list>
      </div>
      <div class="tabs">
        <div class="tab" @click="tabClicked(0)">
          <i class="material-icons">history</i>
        </div>
        <div class="tab" @click="tabClicked(1)">
          <i class="material-icons">face</i>
        </div>
        <div
          class="tab"
          v-for="(e, i) in groupUnicodes"
          :key="i"
          @click="tabClicked(i + 2)"
        >
          <!-- {{ e[0] }} -->
          <div
            class="tab-emoji"
            :style="{ backgroundPosition: findGroupEmojiPos(e[0]) }"
          />
        </div>
      </div>
    </div>
    <div class="triangle" />
  </div>
</template>

<script>
import EmojiTemplate from "./EmojiTemplate";
import VirtualList from "vue-virtual-scroll-list";
import emojiParser from "@/utils/emojiParser.js";
import { mapState } from "vuex";
import { bus } from "@/main";

export default {
  components: { VirtualList, EmojiTemplate },
  data() {
    return {
      emojiWithGroup: [],
      allRecentEmojis: [],
      allCustomEmojis: [],
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
      ]
    };
  },

  mounted() {
    setTimeout(() => {
      const z = performance.now();
      this.allCustomEmojis = this.arrToRows(this.customEmojis);
      const o = performance.now();
      console.log("custom emojis took " + Math.round(o - z) + "ms to load.");
    });
    setTimeout(() => {
      const z = performance.now();
      this.allRecentEmojis = this.arrToRows(this.allRecentEmojisArr());
      const o = performance.now();
      console.log("recent emojis took " + Math.round(o - z) + "ms to load.");
    });
    setTimeout(() => {
      const z = performance.now();
      this.emojiWithGroup = this.emojisWithGroup();
      const o = performance.now();
      console.log("emojis took " + Math.round(o - z) + "ms to load.");
    });
  },

  methods: {
    closePanel() {
      if (!event.target.closest(".emojis-button")) this.$emit("close");
    },
    emojisWithGroup() {
      const emojis = emojiParser.allEmojis;
      const groups = emojiParser.allGroups;
      const emojisWithGroups = [];
      const row = 10;
      let rowIndex = 0;
      let rowItemIndex = 0;
      let currentGroup = 0;

      for (let index = 0; index < emojis.length; index++) {
        const emoji = emojis[index];
        let math = rowItemIndex % row;
        let startNewRow = math === 0;
        if (index === 0) {
          emojisWithGroups[rowIndex] = { gname: groups[emoji.group] };
        }

        if (currentGroup != emoji.group) {
          currentGroup = emoji.group;
          rowIndex += 1;
          emojisWithGroups[rowIndex] = { gname: groups[emoji.group] };
          startNewRow = true;
        }

        if (startNewRow) {
          rowIndex += 1;
          emojisWithGroups[rowIndex] = [emoji];
          rowItemIndex = 1;
        } else {
          emojisWithGroups[rowIndex].push(emoji);
          rowItemIndex += 1;
        }
      }

      return emojisWithGroups;
    },
    allRecentEmojisArr() {
      const emojis = [];
      for (let index = 0; index < this.recentEmojis.length; index++) {
        const shortcode = this.recentEmojis[index];

        const emoji = emojiParser.allEmojis.find(
          e => e.shortcodes[0] === shortcode
        );

        if (!emoji) {
          const cusEmoji = this.customEmojis.find(
            emoji => emoji.name === shortcode
          );
          if (cusEmoji) {
            emojis.push(cusEmoji);
          }
        } else {
          emojis.push(emoji);
        }
      }
      return emojis;
    },
    emojiSpritePos(emojiIndex) {
      const SIZE = -25;
      const row = 40;
      let top = 0;
      let left = 0;

      for (let index = 0; index < emojiIndex + 1; index++) {
        if (index != 0) {
          if (index % row === 0) {
            top += SIZE;
            left = 0;
          } else {
            left += SIZE;
          }
        }
      }
      return `${left}px ${top}px`;
    },
    arrToRows(emojis) {
      const row = 10;
      let rowIndex = 0;
      const newArr = [];
      for (let index = 0; index < emojis.length; index++) {
        const emoji = emojis[index];

        if (index === 0) {
          newArr[rowIndex] = [emoji];
        } else if (index % row === 0) {
          rowIndex += 1;
          newArr[rowIndex] = [emoji];
        } else {
          newArr[rowIndex].push(emoji);
        }
      }
      return newArr;
    },
    emojiClick(emoji) {
      if (emoji.emojiID) {
        bus.$emit("emojiPanel:Selected", emoji.name);
      } else {
        bus.$emit("emojiPanel:Selected", emoji.shortcodes[0]);
      }
    },
    tabClicked(index) {
      const ROW_SIZE = 37;
      const recentRows = this.allRecentEmojis.length + 1;
      const customEmojiRows = this.allCustomEmojis.length + 1;
      if (index === 0) {
        this.$refs.virtualList.setScrollTop(0);
        return;
      }
      if (index === 1) {
        this.$refs.virtualList.setScrollTop(recentRows * ROW_SIZE);
        return;
      }
      const rowIndex = this.emojiWithGroup.findIndex(
        r => r.find && r.find(e => e.group === index - 2)
      );
      this.$refs.virtualList.setScrollTop(
        (recentRows + customEmojiRows + rowIndex) * ROW_SIZE - ROW_SIZE
      );
    },
    findGroupEmojiPos(unicode) {
      return emojiParser.allEmojis.find(e => e.unicode === unicode).pos;
    }
  },
  computed: {
    ...mapState("settingsModule", ["recentEmojis", "customEmojis"])
  }
};
</script>

<style scoped lang="scss">
.emoji-panel {
  position: absolute;
  bottom: -50px;
  right: 20px;
  width: 380px;
  display: flex;
  flex-direction: column;
  z-index: 99999;
}

.emoji-panel-inner {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  border-radius: 4px;
  transition: 0.3s;
  z-index: 99999;
  height: 350px;
  overflow: hidden;
}
.emojis-list {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
}
.category {
  display: flex;
  height: 37px;
  color: white;
  padding-left: 10px;
  align-items: center;
  align-content: center;
  background: rgba(255, 255, 255, 0.1);
}
.emoji-row .wrapper {
  height: 37px;
  display: flex;
  flex-direction: row;
}
.triangle {
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-top: 15px solid #00203a;

  align-self: flex-end;
  margin-right: 46px;
}
.tabs {
  height: 37px;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  width: 100%;
  background: rgba(0, 56, 100, 0.4);
  flex-shrink: 0;
}
.tab {
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  user-select: none;
  height: 37px;
  width: 37px;
  flex-shrink: 0;
  cursor: pointer;
  transition: 0.2s;
  color: white;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
}
.tab .tab-emoji {
  background-image: url("../../../assets/emojiSprites.png");
  background-position: 0px 0px;
  background-repeat: no-repeat;
  background-size: 1000px;
  height: 25px;
  width: 25px;
}
</style>
