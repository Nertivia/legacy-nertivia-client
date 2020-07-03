<template>
  <div class="html-embed" @click="clickEvent" >
    <div class="embed" v-html="html" />
  </div>
</template>

<script>
import { unzipAlt } from "@/utils/zip";
export default {
  props: ["embed"],
  methods: {
      clickEvent(e) {
          e.preventDefault()
          if (e.target.nodeName === "A") {
              const link = e.target.getAttribute("href");
              if (!link) return;
                this.$store.dispatch("setAllPopout", {
                    show: true,
                    type: "OPEN_LINK_CONFIRM",
                    link: link,
                });
          }
      }
  },
  computed: {
    html() {
      return unzipAlt(this.embed);
    }
  }
};
</script>

<style lang="scss" scoped>
.html-embed {
  background: #ffffff21;
  padding: 5px;
  display: flex;
  max-width: 500px;
  max-height: 500px;
  align-self: flex-start;
  margin-top: 5px;
  text-overflow: ellipsis;
  overflow: hidden;

  font-size: 14px;
  white-space: pre-wrap;
  overflow: hidden;
  display: -webkit-box;

  flex-shrink: 0;
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  position: relative;
}

</style>
<style>
.html-embed a {
  color: #68aaff;
}
</style>