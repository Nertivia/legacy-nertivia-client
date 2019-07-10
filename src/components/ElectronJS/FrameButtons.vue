<template>
  <div class="frame-buttons">
    <div
      class="minimize"
      @click="minimizeWindow()"
    >
      <i class="material-icons">minimize</i>
    </div>
    <div
      class="res-max"
      @click="maximizeWindow()"
    >
      <i class="material-icons">check_box_outline_blank</i>
    </div>
    <div
      class="close"
      @click="closeWindow()"
    >
      <i class="material-icons">close</i>
    </div>
  </div>
</template>

<script>
const remote = window.require("electron").remote;

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
  align-items: center;
  -webkit-app-region: drag;
  user-select: none;
}
.frame-buttons div {
  display: flex;
  padding: 5px;
  flex-shrink: 0;
  height: 15px;
  width: 15px;
  border-radius: 5px;
  margin: 3px;
  color: white;
  align-items: center;
  justify-content: center;
  -webkit-app-region: no-drag;
  transition: 0.3s;
  background: rgba(56, 56, 56, 0.247);
}
.frame-buttons .material-icons {
  display: block;
  font-size: 15px;
}
.frame-buttons .close:hover {
  background: rgba(255, 0, 0, 0.595);
}
.frame-buttons .minimize:hover {
  background: rgba(255, 81, 0, 0.595);
}
.frame-buttons .res-max:hover {
  background: rgba(0, 162, 255, 0.595);
}
</style>
