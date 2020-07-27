<template>
  <a :href="linkHttp" target="_blank" @click.prevent="showLinkWarning">{{name}}</a>
</template>

<script>
import { bus } from "@/main";

export default {
  props: ["name", "link"],
  methods: {
    showLinkWarning() {
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "OPEN_LINK_CONFIRM",
        link: this.linkHttp
      });
    }
  },
  computed: {
    linkHttp() {
      return this.link.startsWith('http') ? this.link : `http://${this.link}`
    }
  }

};
</script>

<style scoped>
.channel {
  background: rgba(0, 0, 0, 0.3);
  color: rgb(94, 164, 255);
  font-weight: bold;
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
  transition: 0.2s;
  display: inline-block;
}
.channel:hover {
  background: rgba(0, 0, 0, 0.5);
}
</style>