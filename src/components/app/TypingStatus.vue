<template>
  <transition name="typing-animate">
    <div class="typing-status" v-if="formatedRecipients">
      <object class="animation" type="image/svg+xml" :data="animation"></object>
      <div class="text" v-html="formatedRecipients"></div>
    </div>
  </transition>
</template>

<script>
export default {
  props: ["recipients"],
  data() {
    return {
      animation: require("@/assets/typing-indicator.svg")
    };
  },
  methods: {
    escapeHtml(unsafe) {
      return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  },
  computed: {
    formatedRecipients() {
      const arr = Object.values(this.recipients);
      if (!arr.length) return null;
      switch (true) {
        case arr.length == 1:
          return `<strong>${this.escapeHtml(
            arr[0].username
          )}</strong> is typing...`;
        case arr.length == 2:
          return `<strong>${this.escapeHtml(
            arr[0].username
          )}</strong> and <strong>${this.escapeHtml(
            arr[1].username
          )}</strong> are typing...`;
        case arr.length == 3:
          return `<strong>${this.escapeHtml(
            arr[0].username
          )}</strong>, <strong>${this.escapeHtml(
            arr[1].username
          )}</strong> and <strong>${this.escapeHtml(
            arr[2].username
          )}</strong> are typing...`;
        case arr.length > 3:
          return `<strong>${arr.length}</strong> people are typing...`;
        default:
          break;
      }
      return arr;
    }
  }
};
</script>

<style scoped>

.typing-animate-enter-active {
  transition: 0.1s;
}
.typing-animate-enter /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
  transform: translateY(3px);
}
.typing-animate-leave-to {
  opacity: 0;
  transform: translateY(-3px);
}

.typing-status {
  color: white;
  display: flex;
  transition: 0.3s;
  flex-shrink: 0;
  flex: 1;
}
.animation {
  height: 20px;
  width: 20px;
  display: flex;
}
.text {
  margin: auto;
  margin-left: 5px;
  font-size: 13px;
}
</style>
