<template>
  <div class="frame-buttons">
    <div class="button minimize" @click="minimizeWindow()">
      <i class="material-icons">minimize</i>
    </div>
    <div class="button res-max" @click="maximizeWindow()">
      <i class="material-icons">check_box_outline_blank</i>
    </div>
    <div class="button close" @click="closeWindow()">
      <i class="material-icons">close</i>
    </div>
  </div>
</template>

<script>
const { remote } = window.require("electron");

export default {
  methods: {
    closeWindow() {
      var window = remote.getCurrentWindow();
      window.close();
    },

    minimizeWindow() {
      var window = remote.getCurrentWindow();
      window.minimize();
    },

    maximizeWindow() {
      var window = remote.getCurrentWindow();
      window.isMaximized() ? window.unmaximize() : window.maximize();
    }
  }
};
</script>

<style scoped>
.frame-buttons {
  display: flex;
  user-select: none;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 9999999999999999;
  height: 25px;
  -webkit-app-region: drag;
  justify-content: flex-end;
}
.button {
  -webkit-app-region: no-drag;
}
.frame-buttons div {
  display: flex;
  flex-shrink: 0;
  height: 100%;
  width: 30px;
  color: white;
  align-items: center;
  justify-content: center;
  -webkit-app-region: no-drag;
  transition: 0.3s;
}
.frame-buttons .material-icons {
  display: block;
  font-size: 15px;
}
.frame-buttons .close:hover {
  background: rgba(255, 0, 0, 0.3);
}
.frame-buttons .minimize:hover {
  background: rgba(0, 0, 0, 0.3);
}
.frame-buttons .res-max:hover {
  background: rgba(0, 0, 0, 0.3);
}
</style>
