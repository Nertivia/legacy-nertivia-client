<template>
  <div class="dark-background generic-popout" @mousedown="backgroundClick">
    <div class="inner">
      <div class="text">{{ message }}</div>
      <div class="button" @click="closeMenu()">Okay</div>
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
      this.$store.dispatch("setGenericMessage", null);
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    }
  },
  computed: {
    message() {
      return this.$store.getters.popouts.genericMessage;
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
  background: rgba(0, 0, 0, 0.541);
  z-index: 1119999999999999111;
  display: flex;
}
.inner {
  margin: auto;
  height: 150px;
  width: 350px;
  background: rgb(32, 32, 32);
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 10px;
  overflow: hidden;
}
.text {
  margin: auto;
  margin-bottom: 10px;
  text-align: center;
  word-break: break-word;
}

.button {
  margin-top: 50px;
  background: rgb(0, 162, 255);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  margin: auto;
  margin-top: 10px;
}
</style>
