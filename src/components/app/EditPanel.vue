<template>
  <div class="edit-panel" v-if="selectedChannelID === data.channelID">
    <div class="title">Edit Message:</div>
    <div class="message">{{data.message}}</div>
    <div class="close-button" @click="close">Cancel</div>
  </div>
</template>

<script>
export default {
  props: ['data'],
  methods: {
    close() {
      this.$store.dispatch("setEditMessage", null);
    },
    keyDownEvent(event) {
      if(event.keyCode !== 27) return; // 27 = escape
      this.close();
    }
  },
  created() {
    document.addEventListener('keydown', this.keyDownEvent)
  },
  destroyed() {
    this.$store.dispatch("setEditMessage", null);
    document.removeEventListener('keydown', this.keyDownEvent)
  },
  computed: {
    selectedChannelID() {
      return this.$store.getters.selectedChannelID;
    },
  }
}
</script>


<style scoped>
.edit-panel {
  padding: 10px;
  color: white;
  background: rgba(23, 112, 255, 0.877);
  display: flex;
  flex-direction: column;
  z-index: 99999;
  border-radius: 10px;
  margin: 10px;
  margin-bottom: 0;
}
.top{
  display: flex;
}
.title {
  flex: 1;
}
.close-button {
  color: white;
  background: rgba(0, 0, 0, 0.199);
  padding: 2px;
  border-radius: 3px;
  align-self: flex-end;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
}
.close-button:hover {
  background: rgba(0, 0, 0, 0.431);
}
.message {
  color: rgb(214, 214, 214);
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
