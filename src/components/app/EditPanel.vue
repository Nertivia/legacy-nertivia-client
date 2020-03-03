<template>
  <div class="edit-panel" v-if="selectedChannelID === data.channelID">
    <div class="title">Edit Message:</div>
    <div class="message" v-html="message"></div>
    <div class="close-button" @click="close">Cancel</div>
  </div>
</template>

<script>
import messageFormatter from "@/utils/messageFormatter.js";
import { bus } from "../../main";

export default {
  props: ["data"],
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
    message() {
      return messageFormatter(this.data.message);
    },
    selectedChannelID() {
      return this.$store.getters.selectedChannelID;
    }
  }
};
</script>

<style scoped>
.edit-panel {
  padding: 10px;
  color: white;
  background: #002038;
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
  background: #0061ad;
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
