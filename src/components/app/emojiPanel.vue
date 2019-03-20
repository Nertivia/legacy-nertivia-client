<template>
  <div class="emoji-panel">
    <div class="emoji-panel-inner">
      <div class="emojis-list">
        <div class="category" v-for="(group, index) in groups" :key="group">
          <div class="category-name">{{group}}</div>
          <div class="list">
            <div
              class="emoji-item"
              v-for="emojiSorted in emojiByGroup(index)"
              :key="emojiSorted.shortcodes[0]"
              @click="clickEvent(emojiSorted.shortcodes[0])">
              <img class="panel emoji" v-lazyload :data-url="parseEmojiPath(emojiSorted.unicode)">
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="triangle"></div>
  </div>
</template>

<script>
import { bus } from "@/main";
import emojiParser from "@/utils/emojiParser.js";
import lazyLoad from "@/directives/LazyLoad.js"

import emojis from "emojibase-data/en/compact.json";
import { groups } from "emojibase-data/meta/groups.json";

export default {
  directives: {
    lazyload: lazyLoad
  },
  methods: {
    emojiByGroup(index) {
      index = parseInt(index);
      return emojis.filter(_emoji => _emoji.group === index);
    },
    parseEmojiPath(emoji) {
      return emojiParser.GetEmojiPath(emoji);
    },
    clickEvent(shortcode) {
      bus.$emit('emojiPanel:Selected', shortcode)
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
  width: 370px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.emoji-panel-inner{
  background: rgba(32, 32, 32, 0.87);
  transition: 0.3s;
  border-radius: 5px;
  padding: 3px;
}
.emoji-panel-inner:hover {
  background: rgb(32, 32, 32);
}
.emojis-list {
  color: white;
  padding: 5px;
  user-select: none;
  cursor: default;
  height: 300px;
  overflow-y: auto;
  transition: 0.32s;
}

.category {
}
.category-name {
  padding: 10px;
}
.list {
}
.emoji-item {
  background: rgba(59, 59, 59, 0.521);
  transition: 0.3s;
  display: inline-block;
  margin: 4px;
  padding: 2px;
  border-radius: 5px;
  height: 30px;
  width: 30px;

}
.emoji-item:hover {
  background: rgb(59, 59, 59);
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
}
</style>
