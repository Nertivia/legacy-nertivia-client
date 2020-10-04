<template>
  <div class="drop-down-menu" v-click-outside="outsideClick">
    <div class="item" @click="copyLinkButton">
      <div class="material-icons">link</div>
      <div class="name">{{ $t("copy-url") }}</div>
    </div>

    <div class="item" @click="openURL">
      <div class="material-icons">open_in_new</div>
      <div class="name">{{ $t("open-url") }}</div>
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
      let y = this.contextDetails.y;
      let x = this.contextDetails.x;

      // if context is out of screen
      if (x + this.$el.clientWidth > window.innerWidth) {
        x = window.innerWidth - this.$el.clientWidth;
      }
      if (y + this.$el.clientHeight > window.innerHeight) {
        y = window.innerHeight - this.$el.clientHeight;
      }

      this.$el.style.top = y + "px";
      this.$el.style.left = x + "px";
    },
    openURL() {
      this.closeMenu();
      window.open(this.contextDetails.url, "_blank");
    },
    copyLinkButton() {
      this.closeMenu();
      this.$clipboard(this.contextDetails.url);
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
