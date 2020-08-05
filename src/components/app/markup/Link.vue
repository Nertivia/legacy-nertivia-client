<template>
  <a :href="linkHttp" target="_blank" @click.prevent="showLinkWarning">
    <slot></slot>
  </a>
</template>

<script>
export default {
  props: ["link"],
  methods: {
    showLinkWarning() {
      if (this.$slots.default[0].text === this.linkHttp) {
        let win = window.open(this.$slots.default[0].text, "_blank");
        win.focus();
        return;
      }
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "OPEN_LINK_CONFIRM",
        link: this.linkHttp
      });
    }
  },
  computed: {
    linkHttp() {
      return this.link.startsWith("http") ? this.link : `http://${this.link}`;
    }
  }
};
</script>

<style scoped>
a {
  color: #ffa700;
  text-decoration: underline rgba(255, 255, 255, 0.2);
}

a:hover {
  text-decoration: underline;
}
</style>
