<template>
  <div class="drop-down">
    <div class="title">{{name}}</div>
    <div class="current-select-box" ref="dropDown" @click="dropped = !dropped">
      <div class="name" v-if="noneSelect && selectedItem || !noneSelect">{{selectedItem ? selectedItem.name : items[0].name}}</div>
      <div class="name" v-if="noneSelect && !selectedItem">Select</div>
      <div class="material-icons">expand_more</div>
    </div>
    
    <div class="drop" v-if="dropped">
      <div class="drop-container">
        <div v-for="(item, index) of items" :key="index" class="item" :class="{selected: selectedItem === item}" @click="itemClick(item)">{{item.name}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['items', 'name', 'selectedItem', 'noneSelect'], // noneSelect: by default, nothing will be selected.
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
  background: rgba(22, 22, 22, 0.411);
  border-radius: 5px;
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.current-select-box .name {
  margin: auto;
  margin-left: 2px;
}

.drop {
  position: absolute;
  background: rgb(39, 39, 39);
  border-radius: 5px;
  left: 0;
  right: 0;
  z-index: 11111;
  overflow: hidden;
  padding: 2px;
  margin-top: 5px;
}
.drop-container {
  border-radius: 5px;
  overflow: auto;
  max-height: 100px;
}
.drop-container::-webkit-scrollbar {
  width: 5px;
}
.item {
  padding: 5px;
  border-radius: 5px;
  margin-top: 2px;
  margin-bottom: 2px;
  transition: 0.2s;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.item:hover {
  background: rgb(46, 46, 46);
}
.item.selected {
  background: rgb(63, 63, 63);
}
.material-icons{
  flex-shrink: 0;
}
</style>

