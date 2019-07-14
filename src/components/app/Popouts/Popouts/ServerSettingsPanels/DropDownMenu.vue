<template>
  <div class="drop-down">
    <div class="title">{{name}}</div>
    <div class="current-select-box" ref="dropDown" @click="dropped = !dropped"><div class="name">{{selectedItem ? selectedItem.name : items[0].name}}</div><div class="material-icons">expand_more</div></div>
    <div class="drop" v-if="dropped">
      <div v-for="(item, index) of items" :key="index" class="item" :class="{selected: selectedItem === item}" @click="itemClick(item)">{{item.name}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'name', 'selectedItem'],
  data() {
    return {
      dropped: false
    }
  },
  methods: {
    itemClick(item) {
      this.$emit('change', item)
    },
    documentClick(e) {
      const target = e.target;
      const el = this.$refs.dropDown
      if (((el !== target) && !el.contains(target)) && this.dropped) {
         this.dropped = false;
      }
    }
  },
  created() {
    document.addEventListener('click', this.documentClick);
  },
  destroyed() {
    document.removeEventListener('click', this.documentClick);
  }
}
</script>

<style scoped>
.drop-down {
  background-color: rgb(44, 44, 44);
  border-radius: 10px;
  padding: 5px;
  user-select: none;
  cursor: default;
  flex-shrink: 0;
  position: relative;
}
.title {
  margin-bottom: 2px;
}
.current-select-box {
  background: rgba(22, 22, 22, 0.411);
  border-radius: 10px;
  padding: 5px;
  cursor: pointer;
  display: flex;
  transition: 0.3s;
}
.current-select-box:hover {
  background: rgba(22, 22, 22, 0.788);
}
.current-select-box div {
  align-self: center;
}
.current-select-box .name {
  margin: auto;
  margin-left: 2px;
}
.drop {
  position: absolute;
  background: rgb(80, 80, 80);
  border-radius: 10px;
  left: 0;
  right: 0;
  z-index: 11111;
  max-height: 100px;
  overflow: auto;
  padding: 2px;
  margin-top: 5px;
}
.item {
  padding: 5px;
  border-radius: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  background: rgba(37, 37, 37, 0.322);
}
.item:hover {
  background: rgb(37, 37, 37);
}
.item.selected {
  background: rgb(41, 41, 41);
}
</style>

