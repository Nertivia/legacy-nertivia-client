<template>
  <div id="app" ref="app">
    <vue-headful :title="title" description="Nertivia Chat Client" />
    <div class="background-image"></div>
    <transition name="fade-between-two" appear>
      <ConnectingScreen v-if="!loggedIn" />
      <div class="box" v-if="loggedIn">
        <div class="frame" v-if="isElectron">
          <div class="window-buttons">
            <electron-frame-buttons />
          </div>
        </div>
        <main-nav/>
        <div class="panel-layout">
          <news v-if="currentTab == 3" />
          <direct-message v-if="currentTab == 1" />
          <servers v-if="currentTab == 2" />
          <explore v-if="currentTab == 0" />
        </div>
      </div>
    </transition>
    <Popouts v-if="loggedIn" />
  </div>
</template>

<script>
import { bus } from "../main";
import Popouts from "@/components/app/Popouts/Popouts.vue";
import windowProperties from "@/utils/windowProperties";
import changelog from "@/utils/changelog.js";
import ConnectingScreen from "./../components/app/ConnectingScreen.vue";
import Spinner from "./../components/Spinner.vue";
import MainNav from "./../components/app/MainNav.vue";

const ElectronFrameButtons = () =>
  import("@/components/ElectronJS/FrameButtons.vue");

const News = () =>
  import(/* webpackChunkName: "News" */ "./../components/app/Tabs/News.vue");

const DirectMessage = () => ({
  component: import("./../components/app/Tabs/DirectMessage.vue"),
  loading: Spinner,
  delay: 0
});

const Servers = () => ({
  component: import("./../components/app/Tabs/Servers.vue"),
  loading: Spinner,
  delay: 0
});

const Explore = () => ({
  component: import("./../components/app/Tabs/Explore.vue"),
  loading: Spinner,
  delay: 0
});

export default {
  name: "app",
  components: {
    DirectMessage,
    Servers,
    ConnectingScreen,
    Popouts,
    News,
    ElectronFrameButtons,
    Explore,
    MainNav
  },
  data() {
    return {
      title: "Nertivia",
      isElectron: window && window.process && window.process.type
    };
  },
  methods: {
    dismissNotification(channelID) {
      const notifications = this.$store.getters.notifications.find(function(e) {
        return e.channelID === channelID;
      });

      if (notifications && notifications.count >= 1 && document.hasFocus()) {
        this.$socket.emit("notification:dismiss", { channelID });
      }
    },
    switchChannel(isServer) {
      const serverChannelID = this.$store.state.channelModule.serverChannelID;
      const DMChannelID = this.$store.state.channelModule.DMChannelID;

      if (isServer) {
        this.$store.dispatch("selectedChannelID", serverChannelID);
        const channel = this.$store.state.channelModule.channels[
          serverChannelID
        ];
        this.$store.dispatch("setChannelName", channel ? channel.name : "");
        this.dismissNotification(serverChannelID);
      } else {
        const channel = this.$store.state.channelModule.channels[DMChannelID];
        this.$store.dispatch(
          "setChannelName",
          channel ? channel.recipients[0].username : ""
        );
        this.$store.dispatch("selectedChannelID", DMChannelID);
        this.dismissNotification(DMChannelID);
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
    }
  },
  watch: {
    getWindowWidth(dimensions) {
      this.resizeEvent(dimensions);
    }
  },
  mounted() {
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
  },

  computed: {
    currentTab() {
      return this.$store.getters.currentTab;
    },
    loggedIn() {
      return this.$store.getters.loggedIn;
    },
    serverNotification() {
      const notifications = this.$store.getters.notifications;
      const channels = this.$store.getters.channels;
      const notification = notifications.find(e => {
        return (
          channels[e.channelID] &&
          channels[e.channelID].server_id &&
          e.channelID !== this.$store.getters.selectedChannelID
        );
      });
      return notification;
    },
    DMNotification() {
      const notifications = this.$store.getters.notifications;
      const channels = this.$store.getters.channels;
      const notification = notifications.find(e => {
        return (
          channels[e.channelID] &&
          !channels[e.channelID].server_id &&
          e.channelID !== this.$store.getters.selectedChannelID
        );
      });
      // unopened dm
      if (!notification) {
        return notifications.find(e => {
          return !channels[e.channelID];
        });
      }
      return notification;
    },
    friendRequestExists() {
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

.notifyAnimation {
  animation: notifyAnime;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
}
.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
@keyframes notifyAnime {
  0% {
    background: rgba(121, 3, 3, 0.541);
  }
  40% {
    background: rgba(255, 0, 0, 0.568);
  }
  60% {
    background: rgba(255, 0, 0, 0.568);
  }
  100% {
    background: rgba(121, 3, 3, 0.541);
  }
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



<style>
textarea {
  font-family: "Roboto", sans-serif;
}

.background-image {
  position: fixed;
  z-index: -1;
  width: 100%;
  height: 100%;
  background: linear-gradient(#0B4155, #01677E);
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

