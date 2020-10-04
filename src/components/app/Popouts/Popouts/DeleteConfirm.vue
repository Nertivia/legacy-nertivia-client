<template>
  <div class="dark-background generic-popout" @mousedown="backgroundClick">
    <div class="inner">
      <div class="text">{{ $t("message-delete-confirm") }}</div>
      <MessageTemplate
        class="message"
        :creator="message.creator"
        :message="message"
      />
      <div class="buttons">
        <div class="button" @click="closeMenu">{{ $t("back") }}</div>
        <div class="button alert" @click="deleteMessage">{{ $t("delete") }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import messagesService from "@/services/messagesService";
import MessageTemplate from "@/components/app/MessageTemplate";
export default {
  components: { MessageTemplate },
  methods: {
    closeMenu() {
      this.$store.dispatch("setAllPopout", {
        show: false,
        type: null,
        messageID: null,
        channelID: null
      });
    },
    deleteMessage() {
      messagesService.delete(this.details.messageID, this.details.channelID);
      this.closeMenu();
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
    keyDownEvent(event) {
      if (event.keyCode === 13) {
        this.deleteMessage();
      }
    }
  },
  mounted() {
    setTimeout(() => document.addEventListener("keydown", this.keyDownEvent));
  },
  destroyed() {
    document.removeEventListener("keydown", this.keyDownEvent);
  },
  computed: {
    details() {
      return this.$store.getters.popouts.allPopout;
    },
    message() {
      if (this.details.messageID) {
        const messages = this.$store.getters["messages"][
          this.details.channelID
        ];
        return messages.find(m => m.messageID === this.details.messageID);
      }
      return undefined;
    }
  }
};
</script>

<style scoped>
.dark-background {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
  z-index: 111;
  display: flex;
}
.inner {
  margin: auto;
  width: 450px;
  max-height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 4px;
  overflow: hidden;
  backdrop-filter: blur(5px);
}
.message {
  max-height: 300px;
  overflow: auto;
}
.text {
  margin-bottom: 10px;
  margin-top: 20px;
  text-align: center;
  word-break: break-word;
}

.buttons {
  display: flex;
  align-self: flex-end;
  margin-bottom: 10px;
  margin-right: 5px;
}
.button {
  flex-shrink: 0;
  background: rgb(25, 152, 226);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  margin-left: 5px;
  margin-right: 5px;
  width: 70px;
  text-align: center;
  opacity: 0.8;
  transition: 0.2s;
}
.button:hover {
  opacity: 1;
}
.button.alert {
  background: rgb(255, 46, 46);
}
</style>
