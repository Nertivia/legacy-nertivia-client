<template>
  <div class="drop-down">
    <div class="title">{{name}}</div>
    <div class="current-select-box" ref="dropDown" @click="dropped = !dropped">
      <div class="name" v-if="noneSelect && selectedItem || !noneSelect">
        <div
          class="emoji"
          v-if="selectedItemSorted.emoji || items[0].emoji"
          v-html="selectedItem ? selectedItemSorted.emoji : items[0].emoji"
        ></div>
        <div class="item-name">{{selectedItem ? selectedItemSorted.name : items[0].name}}</div>
      </div>
      <div class="name" v-if="noneSelect && !selectedItem">Select</div>
      <div class="material-icons">expand_more</div>
    </div>

    <div class="drop" v-if="dropped">
      <div class="drop-container">
        <div
          v-for="(item, index) of itemEmojified"
          :key="index"
          class="item"
          :class="{selected: selectedItemSorted === item}"
          @click="itemClick(item)"
        >
          <div class="emoji" v-if="item.emoji" v-html="item.emoji"></div>
          <div class="name">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emojiParser from "@/utils/emojiParser.js";

export default {
  props: ["items", "name", "selectedItem", "noneSelect", "selectBy"], // noneSelect: by default, nothing will be selected.
  data() {
    return {
      dropped: false
    };
  },
  methods: {
    itemClick(item) {
      this.$emit("change", item);
    },
    documentClick(e) {
      const target = e.target;
      const el = this.$refs.dropDown;
      if (el !== target && !el.contains(target) && this.dropped) {
        this.dropped = false;
      }
    }
  },
  created() {
    document.addEventListener("click", this.documentClick);
  },
  destroyed() {
    document.removeEventListener("click", this.documentClick);
  },
  computed: {
    selectedItemSorted() {
      let item = null;
      if (this.selectBy) {
        item = this.items.find(i => i[this.selectBy] === this.selectedItem);
      } else {
        item = this.selectedItem;
      }
      if (item && item.emoji && !item.emoji.startsWith("<img")) {
        item.emoji = emojiParser.replaceEmojis(item.emoji);
      }
      return item;
    },
    itemEmojified() {
      return this.items.map(i => {
        if (i && i.emoji && !i.emoji.startsWith("<img")) {
          i.emoji = emojiParser.replaceEmojis(i.emoji);
        }
        return i;
      });
    }
  }
};
</script>

<style scoped>
.drop-down {
  background-color: #044050;
  padding: 10px;
  user-select: none;
  cursor: default;
  flex-shrink: 0;
  position: relative;
}
.title {
  margin-bottom: 2px;
}
.current-select-box {
  background: #032d38;
  padding: 5px;
  cursor: pointer;
  display: flex;
  transition: 0.3s;
}
.current-select-box:hover {
  background: #02232b;
}
.current-select-box div {
  align-self: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
}
.current-select-box .emoji {
  margin-right: 5px;
}
.current-select-box .name {
  margin: auto;
  margin-left: 2px;
}

.drop {
  position: absolute;
  background-color: #044050;
  left: 0;
  right: 0;
  z-index: 11111;
  overflow: hidden;
  padding: 2px;
  margin-top: 5px;
}
.drop-container {
  overflow: auto;
  max-height: 100px;
}
.drop-container::-webkit-scrollbar {
  width: 5px;
}
.item {
  padding: 5px;
  transition: 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: flex;
  cursor: pointer;
}
.item div {
  align-self: center;
}
.item .emoji {
  margin-right: 5px;
}

.item:hover {
  background: #033442;
}
.item.selected {
  background: #021c23;
}
.material-icons {
  flex-shrink: 0;
}
</style>

<style>
.item .emoji img {
  width: 20px;
  height: 20px;
}
.current-select-box .emoji img {
  width: 20px;
  height: 20px;
}
</style>
