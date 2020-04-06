<template>
  <div class="list">
    <div
      v-for="(channel, i) in list"
      :key="channel.channelID"
      :class="{ item: true, selected: index === i }"
      @mouseenter="hoverEvent"
      @click="clickEvent"
    >
      <div class="dot" />
      <div class="name">{{ channel.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["list"],
  data() {
    return {
      index: 0
    };
  },
  watch: {
    list() {
      this.index = 0;
    }
  },
  methods: {
    hoverEvent(event) {
      const mention = event.target.closest(".item");
      const parent = event.target.parentElement.children;
      if (!mention) return;
      const index = [...parent].findIndex((el) => el === mention);
      if (index >= 0) this.index = index;
    },
    KeySwitch(key) {
      if (key == "up") {
        if (this.index == 0) return (this.index = this.$props.list.length - 1);

        this.index = this.index - 1;
      }
      if (key == "down") {
        if (this.index == this.$props.list.length - 1) return (this.index = 0);
        this.index = this.index + 1;
      }
    },
    clickEvent() {
      this.$emit("chosen")
    },
  },
};
</script>

<style scoped>
.selected {
  color: white;
  background: rgba(255, 255, 255, 0.2);
}
.list {
  position: absolute;
  bottom: -35px;
  left: 50px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 2;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0px 0px 20px 5px #000000bd;
  backdrop-filter: blur(5px);
  border-radius: 4px;
  color: rgba(255, 255, 255, 0.7);
  transition: 0.3s;
  user-select: none;
  cursor: default;
}

.item {
  display: flex;
  padding: 5px;
  align-content: center;
  align-items: center;
  cursor: pointer;
}
.selected .dot {
  background: white;
}
.dot {
  height: 5px;
  width: 5px;
  margin-right: 10px;
  margin-left: 5px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.7);
}

@media (max-height: 441px) {
  .list {
    max-height: 150px;
  }
}
</style>
