<template>
  <div class="drop-down-menu" v-click-outside="outsideClick">
    <div class="item" @click="cutButton">
      <div class="name">{{ $t("cut") }}</div>
    </div>

    <div class="item" @click="copyButton">
      <div class="name">{{ $t("copy") }}</div>
    </div>

    <div class="item" @click="pasteButton">
      <div class="name">{{ $t("paste") }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setAllPopout", {
        show: false,
        type: null
      });
    },
    outsideClick(event) {
      if (event.target.classList.contains("options-button")) return;
      this.closeMenu();
    },
    setPosition() {
      let y = this.contextDetails.y - this.$el.clientHeight;
      let x = this.contextDetails.x;

      // if context is out of screen
      if (x + this.$el.clientWidth > window.innerWidth) {
        x = window.innerWidth - this.$el.clientWidth;
      }

      this.$el.style.top = y + "px";
      this.$el.style.left = x + "px";
    },
    cutButton() {
      this.closeMenu();
      this.contextDetails.input.focus();
      document.execCommand("cut");
    },
    pasteButton() {
      this.closeMenu();
      const textarea = this.contextDetails.input;
      const len = textarea.value.length;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const sel = textarea.value.substring(start, end);
      console.log(len, start, end, sel);
      console.log(start, end);
      navigator.clipboard
        .readText()
        .then(text => {
          textarea.value =
            textarea.value.substring(0, start) +
            text +
            textarea.value.substring(end, len);
        })
        .catch(err => {
          console.error("Failed to read clipboard contents: ", err);
        });
    },
    copyButton() {
      this.closeMenu();
      this.contextDetails.input.focus();
      document.execCommand("copy");
    }
  },
  mounted() {
    this.setPosition();
  },
  watch: {
    contextDetails() {
      this.setPosition();
    }
  },
  computed: {
    contextDetails() {
      return this.$store.getters.popouts.allPopout;
    },
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ContextMenu.scss";
</style>
