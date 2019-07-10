<template>
  <div class="dark-background" @mousedown="backgroundClick">
    <div class="inner">
      <div class="tabs">
        <div class="tab" v-for="(tab, _index) in tabs" :key="_index" :class="{selected: index === _index, critical: tab.critical}" @click="index = _index"><div class="material-icons">{{tab.icon}}</div><div>{{tab.title}}</div></div>
      </div>
      <div class="content">
        <div class="header" :class="{critical: tabs[index].critical}"><div class="material-icons">{{tabs[index].icon}}</div><div>{{tabs[index].title}}</div></div>
        <!-- <general v-if="index === 0"/> -->
        <manage-channels v-if="index === 0"/>
        <delete-server v-if="index === 1"/>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import Spinner from "@/components/Spinner.vue";
import ServerService from "@/services/ServerService";
import { mapState } from "vuex";

// panels
import General from './General.vue'
import DeleteServer from './DeleteServer.vue'
import ManageChannels from './ManageChannels.vue'

export default {
  components: {Spinner, General, DeleteServer, ManageChannels},
  data() {
    return {
      index: 0,
      tabs: [
        // {title: "General", icon: "info"},
        {title: "Manage Channels", icon: "storage"},
        // {title: "Manage Invites", icon: "local_post_office"},
        {title: "Delete Server", icon: "warning", critical: true},
      ]
    }
  },

  methods: {
    closeMenu() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "showServerInviteMenu",
        visibility: false
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    },
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID
      return this.$store.getters['servers/servers'][serverID]
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
  z-index: 111111;
  display: flex;
}
.inner {
  margin: auto;
  height: 400px;
  width: 600px;
  background: rgba(32, 32, 32, 0.87);
  display: flex;
  color: white;
  overflow: hidden;
  border-radius: 10px;
}


.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.tabs {
  background: rgba(26, 26, 26, 0.897);
  height: 100%;
  width: 180px;
  flex-shrink: 0;
}
.tab {
  border-radius: 5px;
  margin: 5px;
  padding: 5px;
  transition: 0.2s;
  cursor: default;
  user-select: none;
  display: flex;
  align-content: center;
}
.tab .material-icons {
  margin-right: 3px;
}
.tab div {
  align-self: center;
}
.tab:hover {
  background: rgb(39, 39, 39);
}
.critical {
  color: red;
}
.tab.selected {
  background: rgb(59, 59, 59);
}
.header{
  background: rgb(75, 75, 75);
  display: flex;
  height: 50px;
  flex-shrink: 0;
  width: 100%;
  user-select: none;
  cursor: default;
}
.header div {
  align-self: center;
  margin-left: 10px;
}
</style>
