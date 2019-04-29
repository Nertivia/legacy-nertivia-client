<template>
  <div class="dark-background" @click="backgroundClick">
    <div class="inner">
      
    </div>
  </div>
</template>

<script>
import { bus } from "@/main";
import settingsService from "@/services/settingsService";

export default {
  methods: {
    closeMenu() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "GDLinkMenu",
        visibility: false
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
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
  background: rgba(0, 0, 0, 0.781);
  z-index: 111111;
  display: flex;
}
.inner {
  margin: auto;
  height: 400px;
  width: 400px;
  background: rgb(32, 32, 32);
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 3px;
}

</style>

