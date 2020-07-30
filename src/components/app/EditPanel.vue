<template>
  <div class="edit-panel" v-if="currentChannelID === data.channelID">
    <div class="title">Edit Message:</div>
    <Markup class="message" :text="data.message" />
    <div class="close-button" @click="close">Cancel</div>
  </div>
</template>

<script>
import Markup from "./Markup.vue";
import { bus } from "../../main";

export default {
  props: ["data"],
  components: { Markup },
  methods: {
    close() {
      this.$store.dispatch("setEditMessage", null);
    },
    keyDownEvent(event) {
      if (event.keyCode !== 27) return; // 27 = escape
      this.close();
    }
  },
  mounted() {
    bus.$emit("scrollDown");
  },
  created() {
    document.addEventListener("keydown", this.keyDownEvent);
  },
  destroyed() {
    this.$store.dispatch("setEditMessage", null);
    document.removeEventListener("keydown", this.keyDownEvent);
  },
  computed: {
    currentChannelID() {
      return this.$store.getters.currentChannelID;
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global";
.edit-panel {
  padding: 10px;
  color: white;
  background: #1f2329;
  display: flex;
  flex-direction: column;
  z-index: 1;
  margin-bottom: 0;
}
.top {
  display: flex;
}
.title {
  flex: 1;
}
.close-button {
  color: white;
  background: $primary-button-color;
  padding: 4px;
  align-self: flex-end;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
  border-radius: 4px;
}
.message {
  color: rgb(214, 214, 214);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>

<style>
.edit-panel img.emoji {
  object-fit: contain;
  height: 2em;
  width: 2em;
  margin: 1px;
  vertical-align: -9px;
}
</style>
