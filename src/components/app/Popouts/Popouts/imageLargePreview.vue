<template>
  <div ref="background" class="drop-background preview-popout">
    <div class="img-outer" @contextmenu="imageContextEvent">
      <img :src="$store.getters.popouts.ImagePreviewURL" />
    </div>
  </div>
</template>
<script>
import isElectron from "../../../../utils/ElectronJS/isElectron";
export default {
  mounted() {
    this.$refs["background"].addEventListener(
      "click",
      this.backgroundClickEvent
    );
  },
  beforeDestroy() {
    this.$refs["background"].removeEventListener(
      "click",
      this.backgroundClickEvent
    );
  },
  methods: {
    backgroundClickEvent(event) {
      if (
        event.target.matches(".img-outer") ||
        event.target.matches(".drop-background")
      ) {
        this.$store.dispatch("setImagePreviewURL", event.target.src);
      }
    },
    imageContextEvent(event) {
      if (isElectron) {
        event.preventDefault(true);
      } else {
        return;
      }
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "IMAGE_CONTEXT",
        url: this.$store.getters.popouts.ImagePreviewURL,
        x: event.clientX,
        y: event.clientY
      });
    }
  }
};
</script>

<style scoped>
.drop-background {
  position: absolute;
  background: rgba(0, 0, 0, 0.774);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
  height: 100%;
  user-select: none;
}

.img-outer {
  margin: auto;
  height: 90%;
  width: 90%;
  display: flex;
}
img {
  margin: auto;
  max-height: 100%;
  max-width: 100%;
  width: auto;
  height: auto;
  user-select: none;
}
</style>
