<template>
  <div class="dark-background" @mousedown="backgroundClick">
    <div class="inner">
      <div class="tabs">
        <div
          class="tab"
          v-for="(tab, _index) in tabs"
          :key="_index"
          :class="{ selected: index === _index, critical: tab.critical }"
          @click="index = _index"
        >
          <div class="material-icons">{{ tab.icon }}</div>
          <div>{{ tab.title }}</div>
        </div>
      </div>
      <div class="content">
        <div class="header" :class="{ critical: tabs[index].critical }">
          <div class="material-icons">{{ tabs[index].icon }}</div>
          <div>{{ tabs[index].title }}</div>
          <div class="close-button" @click="closeMenu">
            <div class="material-icons">close</div>
          </div>
        </div>
        <general v-if="index === 0" />
        <manage-channels v-if="index === 1" />
        <manage-bans v-if="index === 2" />
        <server-visibility v-if="index === 3" />
        <delete-server v-if="index === 4" />
      </div>
    </div>
  </div>
</template>

<script>
// panels
import General from "./General.vue";
import DeleteServer from "./DeleteServer.vue";
import ManageChannels from "./ManageChannels.vue";
import ManageBans from "./ManageBans.vue";
import ServerVisibility from "./ServerVisibility.vue";
export default {
  components: {
    General,
    DeleteServer,
    ManageChannels,
    ServerVisibility,
    ManageBans
  },
  data() {
    return {
      index: 0,
      tabs: [
        { title: "General", icon: "info" },
        { title: "Manage Channels", icon: "storage" },
        // {title: "Manage Invites", icon: "local_post_office"},
        { title: "Banned Members", icon: "lock" },
        { title: "Server Visibility", icon: "visibility" },
        { title: "Delete Server", icon: "warning", critical: true }
      ]
    };
  },

  methods: {
    closeMenu() {
      this.$store.dispatch("setServerSettings", {
        serverID: null
      });
    },
    backgroundClick(e) {
      if (e.target.classList.contains("dark-background")) {
        this.closeMenu();
      }
    }
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    }
  }
};
</script>

<style scoped lang="scss">
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
  height: 100%;
  max-height: 550px;
  width: 700px;
  display: flex;
  color: white;
  overflow: hidden;
  position: relative;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background: linear-gradient(#0b4155, #01677e);
  border-radius: 4px;
}

.content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.tabs {
  display: flex;
  flex-direction: column;
  background: #00000033;
  height: 100%;
  width: 180px;
  flex-shrink: 0;
}
.tab {
  padding: 5px;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  display: flex;
  align-content: center;
  flex-shrink: 0;
  font-size: 15px;
  .material-icons {
    font-size: 24px;
    color: rgba(255, 255, 255, 0.8);
  }
}
.tab .material-icons {
  margin-right: 5px;
}
.tab div {
  align-self: center;
}
.tab:hover {
  background: #072935;
}
.critical {
  color: red;
}
.tab.selected {
  background: #051f28;
}
.header {
  background: #05222d;
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

.close-button {
  display: flex;
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
  position: absolute;
  top: 5px;
  right: 5px;
}
.close-button:hover {
  background: rgba(37, 37, 37, 0.692);
}
.close-button .material-icons {
  margin: auto;
  font-size: 30px;
}

@media (max-width: 614px) {
  .close-button {
    top: 55px;
  }
  .inner {
    height: 100%;
    border-radius: 0;
    max-height: initial;
    flex-direction: column;
  }
  .tabs {
    width: 100%;
    height: 50px;
    flex-direction: row;
    overflow: auto;
  }
  .tabs::-webkit-scrollbar {
    height: 5px;
  }
}
</style>
