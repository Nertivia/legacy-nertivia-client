<template>
  <div class="button" :class="{disabled: posting}" @click="onButtonClick">{{button.name}}</div>
</template>

<script>
import messagesService from '../../services/messagesService';
export default {
  props: ["message", "button"],
  data() {
    return {
      posting: false,
      timeout: null
    };
  },
  methods: {
    async onButtonClick() {
      if (this.posting) return;
      this.posting = true;
      this.$socket.client.once("message_button_click_callback", this.onCallback)
      messagesService.buttonClick(this.message.channelID, this.message.messageID, this.button.id)
      this.timeout = setTimeout(() => {
        this.posting = false;
      }, 20000);
    },
    onCallback(data) {
      if (data.id !== this.button.id) return;
      this.posting = false;
      clearTimeout(this.timeout);
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "NOTIFICATION_POPOUT",
        message: data.message,
        id: Math.random().toString()
      });
    }
  },
  destroyed() {
    this.$socket.client.off("message_button_click_callback", this.onCallback);
  }
};
</script>

<style scoped lang="scss">
.button {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  text-align: center;
  font-size: 14px;
  user-select: none;
  cursor: pointer;
  min-width: 18px;
  border-radius: 4px;
  margin-bottom: 5px;
  margin-right: 5px;
  transition: 0.2s;
}

.button:hover {
  background: rgba(0, 0, 0, 0.5);
}

.button.disabled {
  background: rgba(0, 0, 0, 0.2);
  opacity: 0.3;
  cursor: not-allowed;
}
</style>
