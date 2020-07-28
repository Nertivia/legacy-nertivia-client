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