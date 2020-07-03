<template>
  <div class="dark-background generic-popout" @mousedown="backgroundClick">
    <div class="inner">
      <div class="text">Are you sure that you want to visit this potentially harmful link? </div>
      <div class="link">{{details.link}} </div>
      <div class="buttons">
        <div class="button" @click="closeMenu">Back</div>
        <div class="button alert" @click="visit">Visit</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    closeMenu() {
      this.$store.dispatch("setAllPopout", {
        show: false,
        type: null,
      });
    },

    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
    visit() {
      var win = window.open(this.details.link, '_blank');
      win.focus();
    }
  },

  computed: {
    details() {
      return this.$store.getters.popouts.allPopout;
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
  background: rgba(0, 0, 0, 0.4);
  z-index: 111;
  display: flex;
}
.inner {
  margin: auto;
  width: 450px;
  max-height: 100%;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  color: white;
  border-radius: 4px;
  overflow: hidden;
  backdrop-filter: blur(9px);
}
.message {
  max-height: 300px;
  overflow: auto;
}
.text {
  margin-bottom: 10px;
  margin-top: 20px;
  text-align: center;
  word-break: break-word;
}
.link {
  margin-bottom: 10px;
  text-align: center;
  word-break: break-word;
}
.buttons {
  display: flex;
  align-self: flex-end;
  margin-bottom: 10px;
  margin-right: 5px;
}
.button {
  flex-shrink: 0;
  background: rgb(25, 152, 226);
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  user-select: none;
  margin-left: 5px;
  margin-right: 5px;
  width: 70px;
  text-align: center;
  opacity: 0.8;
  transition: 0.2s;
}
.button:hover {
  opacity: 1;
}
.button.alert {
  background: rgb(255, 46, 46);
}
</style>
