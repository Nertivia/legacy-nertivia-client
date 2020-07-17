<template>
  <div id="app" ref="app" :class="{ desktop: isElectron }">
    <vue-headful :title="title" description="Nertivia Chat Client" />
    <div class="background-color"></div>
    <transition-group name="fade-between-two" appear mode="in-out">
      <ConnectingScreen key="connect-screen" v-if="!ready" />
      <div class="box" key="content" v-if="loggedIn">
        <div class="frame" v-if="isElectron">
          <div class="window-buttons">
            <electron-frame-buttons />
          </div>
        </div>
        <main-nav v-if="$mq !== 'mobile' || currentTab === 3 || currentTab === 4" />
        <div class="panel-layout">
          <news v-if="currentTab == 3" />
          <servers v-if="currentTab == 1 || currentTab == 2" />
          <!-- <servers v-if="currentTab == 2" /> -->
          <explore v-if="currentTab == 0" />
          <admin-panel v-if="currentTab == 4" />
        </div>
      </div>
    </transition-group>
    <Popouts v-if="loggedIn" />
  </div>
</template>

<script>
import { bus } from "../main";
import Popouts from "@/components/app/Popouts/Popouts.vue";
import windowProperties from "@/utils/windowProperties";
import changelog from "@/utils/changelog.js";
import ConnectingScreen from "./../components/app/ConnectingScreen.vue";
import Spinner from "./../components/global/Spinner.vue";
import MainNav from "./../components/app/MainNav.vue";
import ThemeService from "../services/ThemeService";
import ExploreService from "../services/exploreService";

const zip = () => import("@/utils/zip");

const ElectronFrameButtons = () =>
  import("@/components/ElectronJS/FrameButtons.vue");

const News = () =>
  import(/* webpackChunkName: "News" */ "./../components/app/Tabs/News.vue");

// const DirectMessage = () => ({
//   component: import("./../components/app/Tabs/DirectMessage.vue"),
//   loading: Spinner,
//   delay: 0
// });

const Servers = () => ({
  component: import("./../components/app/Tabs/ServerAndDMTab"),
  loading: Spinner,
  delay: 0
});

const Explore = () => ({
  component: import("./../components/app/Tabs/Explore.vue"),
  loading: Spinner,
  delay: 0
});
const AdminPanel = () => ({
  component: import("./../components/app/Tabs/AdminPanel.vue"),
  loading: Spinner,
  delay: 0
});

let ipcRenderer;
if (window.require) {
  ipcRenderer = window.require("electron").ipcRenderer;
}

export default {
  name: "app",
  components: {
    // DirectMessage,
    Servers,
    ConnectingScreen,
    Popouts,
    News,
    AdminPanel,
    ElectronFrameButtons,
    Explore,
    MainNav
  },
  data() {
    return {
      title: "Nertivia",
      isElectron: window && window.process && window.process.type,
      ready: false,
      programActivityTimeout: undefined,
      currentActiveProgram: undefined
    };
  },
  methods: {
    keyDown(event) {
      if (event.altKey) {
        if (!event.ctrlKey) {
          event.preventDefault();
          if (event.key === "ArrowUp") {
            bus.$emit("channels:changeCurrentIndex", "up")
          }
          if (event.key === "ArrowDown") {
            bus.$emit("channels:changeCurrentIndex", "down")
          }
          if (event.key === "ArrowLeft") {
            bus.$emit("channels:changeCurrentIndex", "left")
          }
          if (event.key === "ArrowRight") {
            bus.$emit("channels:changeCurrentIndex", "right")
          }
        } else {
          if (event.key === "ArrowUp") {
            bus.$emit("servers:changeCurrentIndex", "up")
          }
          if (event.key === "ArrowDown") {
            bus.$emit("servers:changeCurrentIndex", "down")
          }
        }
      }
    },
    switchChannel(isServer) {
      const serverChannelID = this.$store.state.channelModule.serverChannelID;
      const DMChannelID = this.$store.state.channelModule.DMChannelID;

      if (isServer) {
        this.$store.dispatch("currentChannelID", serverChannelID);
        const channel = this.$store.state.channelModule.channels[
          serverChannelID
        ];
        this.$store.dispatch("setChannelName", channel ? channel.name : "");
      } else {
        const channel = this.$store.state.channelModule.channels[DMChannelID];
        this.$store.dispatch(
          "setChannelName",
          channel ? channel.recipients[0].username : ""
        );
        this.$store.dispatch("currentChannelID", DMChannelID);
      }
    },
    switchTab(index) {
      localStorage.setItem("currentTab", index);
      this.$store.dispatch("setCurrentTab", index);
      if (index == 1) {
        //1: direct message tab.
        this.switchChannel(false);
      } else if (index === 2) {
        //2: server tab
        this.switchChannel(true);
      }
    },
    resizeEvent(dimensions) {
      const width = dimensions.width;
      const height = dimensions.height;
      this.$refs.app.style.height = height + "px";
      this.$refs.app.style.width = width + "px";
    },
    async setTheme() {
      const themeAppliedID = localStorage.getItem("appliedThemeId");

      if (!themeAppliedID) {
        return;
      }
      let exploreThemes = await ExploreService.applyTheme(themeAppliedID);
      let privateThemes;
      if (!exploreThemes.ok) {
        privateThemes = await ThemeService.getTheme(themeAppliedID);
      }
      let id;
      let css;
      if (exploreThemes.ok) {
        css = exploreThemes.result.data.css;
        id = exploreThemes.result.data.id;
      }
      if (privateThemes && privateThemes.ok) {
        css = privateThemes.result.data.css;
        id = privateThemes.result.data.id;
      }
      if (!id && !css) {
        return;
      }
      zip().then(utils => {
        css = utils.unzip(css) || css;

        const styleEl = document.createElement("style");
        styleEl.id = "theme";
        styleEl.classList.add("theme-" + id);
        styleEl.innerHTML = css;
        document.head.innerHTML += styleEl.outerHTML;
      });
    },
    sendElectronNotification(notificationExists) {
      if (this.isElectron) {
        ipcRenderer.send("notification", !!notificationExists);
      }
    },
    activityStatusChanged(event, filename) {
      if (!filename) {
        this.currentActiveProgram = undefined;
        this.$socket.client.emit('programActivity:set', undefined);
        return;
      }
      const storedPrograms = JSON.parse(localStorage.getItem("activity_status"));
      if (!storedPrograms) return undefined;
      const program = storedPrograms.find(sp => sp.filename === filename);
      this.currentActiveProgram = program; 
      this.$socket.client.emit('programActivity:set', {name: program.name, status: program.status})
    },
    emitActivity(){
      if (this.currentActiveProgram) {
        this.$socket.client.emit('programActivity:set', {name: this.currentActiveProgram.name, status: this.currentActiveProgram.status})
      }
      this.programActivityTimeout = setTimeout(this.emitActivity, 180000); // 3 minutes
    },
    setNotification() {
      const notification = this.latestNotification;
      if (!notification) {
        document.querySelector("link[rel='icon']").setAttribute("href", "/favicon.ico")
        bus.$emit("title:change", "Nertivia")
        return; 
      }
      bus.$emit("title:change", `${notification.sender.username} - Nertivia`)
      document.querySelector("link[rel='icon']").setAttribute("href", "/favicon-notification.ico")
    }
  },
  watch: {
    getWindowWidth(dimensions) {
      this.resizeEvent(dimensions);
    },
    loggedIn(val) {
      setTimeout(() => {
        this.ready = val;
      });
      if (this.isElectron) {
        if (!val) {
          clearTimeout(this.programActivityTimeout)
          this.programActivityTimeout = undefined;
          this.currentActiveProgram = undefined;
        } else {
          const storedPrograms = JSON.parse(localStorage.getItem("activity_status")) || [];
          const programNameArr = storedPrograms.map(sp => sp.filename)
          ipcRenderer.send("activity_status:update", programNameArr)
          setTimeout(this.emitActivity, 180000); // 3 minutes
        }
      }
    },
    allNotificationExists(val) {
      this.sendElectronNotification(val);
    },
    latestNotification() {
      this.setNotification();
    }
  },
  async mounted() {
    this.setNotification()
    if (this.isElectron) {
      ipcRenderer.on("activity_status:changed", this.activityStatusChanged)

    }
    window.addEventListener('keydown', this.keyDown)
    this.sendElectronNotification(false);
    if (this.loggedIn) {
      this.ready = true;
    }
    const currentTab = localStorage.getItem("currentTab");
    if (currentTab) {
      this.$store.dispatch("setCurrentTab", parseInt(currentTab));
    }
    // check if changelog is updated
    const seenVersion = localStorage.getItem("changelog-version-seen");
    if (seenVersion && seenVersion < changelog[0].version) {
      localStorage.setItem("currentTab", 3);
      this.$store.dispatch("setCurrentTab", 3);
    }
    localStorage.setItem("changelog-version-seen", changelog[0].version);
    bus.$on("title:change", title => {
      this.title = title;
    });
    bus.$on("tab:switch", tab => {
      this.switchTab(tab);
    });
    this.setTheme();
  },
  destroyed() {
    if (this.isElectron) {
      ipcRenderer.off("activity_status:changed", this.activityStatusChanged)
    }
    window.removeEventListener('keydown', this.keyDown)
  },

  computed: {
    allNotificationExists() {
      return this.notificationExists || this.friendRequestExists;
    },
    currentTab() {
      return this.$store.getters.currentTab;
    },
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    notificationExists() {
      return this.$store.getters.notifications.length;
    },
    latestNotification() {
      if (!this.notificationExists) return;
      const notifications = this.$store.getters.notifications
      const latestMessage = notifications[notifications.length - 1];
      return latestMessage
    },
    friendRequestExists() {
      if (!this.$store.getters.user) return;
      const allFriend = this.$store.getters.user.friends;
      const result = Object.keys(allFriend).map(function(key) {
        return allFriend[key];
      });
      return result.find(friend => friend.status === 1);
    },
    getWindowWidth() {
      return {
        width: windowProperties.resizeWidth,
        height: windowProperties.resizeHeight
      };
    }
  }
};
</script>

<style scoped>
#app {
  position: fixed;
  width: 100%;
  height: 100%;
}

.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}

.coming-soon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.39);
  color: white;
}

.coming-soon .material-icons {
  font-size: 100px;
}

.direct-message-tab {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
}

.frame {
  display: flex;
  -webkit-app-region: drag;
  flex-shrink: 0;
  height: 25px;
  background: #00000038;
}

.window-buttons {
  position: relative;
  min-width: 175px;
  flex: 1;
}

.tabs {
  display: flex;
  flex-shrink: 0;
  height: 40px;

  overflow-y: hidden;
  overflow-x: auto;
  max-width: 500px;
  flex-basis: auto; /* default value */
  flex-grow: 1;
}

.tabs::-webkit-scrollbar {
  height: 5px;
}
.tabs {
  scrollbar-width: thin;
}

.tab {
  flex-shrink: 0;
  margin-bottom: 0;
  background: rgba(0, 0, 0, 0.253);
  color: rgba(255, 255, 255, 0.822);
  padding: 10px;
  padding-left: 14px;
  padding-right: 14px;
  cursor: default;
  user-select: none;
  transition: 0.3s;
  -webkit-app-region: no-drag;
  cursor: pointer;
  position: relative;
  border-right: solid 1px rgba(0, 0, 0, 0.5);
}

.tab:hover {
  background: rgba(0, 0, 0, 0.418);
}

.tab.selected {
  background: rgba(0, 0, 0, 0.671);
  color: white;
}

.tab .material-icons {
  font-size: 15px;
  vertical-align: -2px;
}

.slidein-enter-active,
.slidein-leave-active {
  transition: 0.5s;
}
.slidein-enter, .slidein-leave-to /* .fade-leave-active below version 2.1.8 */ {
  margin-left: -300px;
}

.fade-between-two-enter-active,
.fade-between-two-leave-active {
  transition: 0.3s;
}
.fade-between-two-enter,
.fade-between-two-leave-to {
  opacity: 0 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>

<style lang="scss">
@import "@/styles/global";
textarea {
  font-family: "Montserrat", sans-serif;
}

.background-color {
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: $bg-color;
}

.panel-layout {
  display: flex;
  overflow: auto;
  height: 100%;
}

input {
  padding: 10px;
  background: rgba(0, 0, 0, 0.301);
  outline: none;
  border: none;
  color: white;
  margin-top: 5px;
  margin-bottom: 10px;
  width: 200px;
  transition: 0.3s;
}

input:hover {
  background: rgba(0, 0, 0, 0.452);
}

input:focus {
  background: rgba(0, 0, 0, 0.603);
}
</style>
