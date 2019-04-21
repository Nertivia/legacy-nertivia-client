<template>
  <div class="drop-down">
    <div class="main-name">{{name}}</div>
    <div class="box" @click="opened = !opened">
      <div class="selected" >
        <div class="emoji" v-if="selected !== null && updateItems[selected]" v-html="updateItems[selected].emoji || ''"></div>
        {{selected === null ? 'Select One' : updateItems[selected].name}}
      </div>
      <i class="material-icons">expand_more</i>
    </div>
    <div class="drop-down-menu" v-if="opened">
      <div
        class="item"
        v-for="(item, index) in updateItems"
        :key="index"
        @click="itemClickEvent(index)"
      >
        <div class="content">
          <div class="emoji" v-html="item.emoji"></div>
          <div class="name">{{item.name}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import emojiParser from "@/utils/emojiParser.js";
import { constants } from 'crypto';
export default {
  model: {
    prop: "itemSelected",
    event: "change"
  },
  props: ["items", "name", "itemSelected", "default"], // items: [{emoji, name}...]
  data() {
    return {
      opened: false,
      selected: this.default || null
    };
  },
  methods: {
    itemClickEvent(index) {
      this.selected = index;
      this.$emit("change", index);
      this.opened = false;
    }
  },
  watch: {
    updateItems() {
			this.selected = null;
    },
    itemSelected(){
      this.selected = this.itemSelected;
    }
  },
  computed: {
    updateItems() {
			this.$emit("change", null);
      let newArr = [];
      for (let index = 0; index < this.items.length; index++) {
				let element = this.items[index];
				if (element.emoji) {
					if (element.emoji.startsWith("<img")) return this.items
					element.emoji = emojiParser.replaceEmojis(element.emoji);
					newArr.push(element);
				} else {
					element.emoji = ""
					newArr.push(element);
				}
      }
      return newArr;
    }
  }
};
</script>

<style scoped>
.material-icons {
  margin-right: 10px;
}
.main-name {
  margin-top: 10px;
  margin-bottom: 5px;
}
.drop-down {
  width: 220px;
  user-select: none;
  cursor: default;
  position: relative;
}

.box {
  width: 100%;
  height: 44px;
  background: rgba(61, 61, 61, 0.863);
  display: flex;
  flex-direction: row;
  align-content: center;
  align-items: center;
  border-radius: 5px;
  transition: 0.3s;
}
.box:hover {
  background: rgba(73, 73, 73, 0.863);
}

.selected {
  flex: 1;
  display: flex;
  align-content: center;
  align-items: center;
  margin-left: 10px;
}

.drop-down-menu {
  display: flex;
  flex-direction: column;
  width: 100%;
  background: rgba(49, 49, 49, 0.945);
  max-height: 200px;
  width: 220px;
  overflow: auto;
  border-radius: 5px;
}
.item {
  width: 100%;
  margin-top: 2px;
  margin-bottom: 2px;
  transition: 0.3s;
}
.item:hover {
  background: rgb(65, 65, 65);
}
.content {
  display: flex;
  align-content: center;
  align-items: center;
  margin: 3px;
}
.emoji {
  margin-right: 5px;
  margin-left: 1px;
}
</style>

<style>
.drop-down-menu img {
  height: 20px !important;
  width: 20px !important;
}
</style>
 
