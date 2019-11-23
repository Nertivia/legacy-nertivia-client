<template>
  <div class="my-profile-panel">

    <div class="switches">
      <div class="checkbox" @click="toggleStart">
        <div class="checkbox-box" :class="{selected:startApp}" />
        <div class="checkbox-name">
          Start Nertivia when Windows starts.
        </div>
      </div>
      <div class="checkbox" v-if="startApp" @click="toggleStartMinimized">
        <div class="checkbox-box" :class="{selected:startMinimized}" />
        <div class="checkbox-name">
          Start minimized.
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import isElectron from '@/utils/ElectronJS/isElectron';
import config from "@/config.js";
const { ipcRenderer, remote} = window.require("electron");
const Store = remote.require('electron-store');
const store = new Store();

export default {
  data() {
    return {
      startApp: store.get('startup.enabled', true),
      startMinimized: store.get('startup.minimized', true)
    };
  },
  methods: {
    toggleStart() {
      this.startApp = !this.startApp;
      ipcRenderer.send('startupOption', {startApp: this.startApp, startMinimized: this.startMinimized})
    },
    toggleStartMinimized() {
      this.startMinimized = !this.startMinimized;
      ipcRenderer.send('startupOption', {startApp: this.startApp, startMinimized: this.startMinimized})
    }
  },
  mounted() {

  },
  computed: {

  },
};
</script>
<style scoped>

.switches {
  display: flex;
  flex-direction: column;
  margin: 20px;
  user-select: none;
}

.checkbox {
  display: flex;
  margin-top: 3px;
  margin-bottom: 3px;
  cursor: pointer;
  align-self: flex-start;
}
.checkbox-box {
  background: rgba(88, 88, 88, 0.74);
  height: 20px;
  width: 20px;
  margin: 10px;
  margin-top: auto;
  margin-bottom: auto;
  transition: 0.3s;
}

.checkbox-box.selected {
  background: rgba(66, 122, 244, 0.74);
}

.checkbox-box.selected:hover {
  background: rgba(66, 122, 244, 0.94);
}

.checkbox-box:hover {
  background: rgba(88, 88, 88, 0.94);
}
.checkbox-name {
}

.message-example{
  padding: 10px;
  background: rgba(88, 88, 88, 0.44);
  border-radius: 10px;
  margin: 10px;
}
.title{
  font-size: 20px;
  text-align: center;
  margin-bottom: 5px;
}

.hidden {
  display: none;
}
.my-profile-panel {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
}

</style>
