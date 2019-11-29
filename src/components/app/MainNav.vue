<template>
  <div class="navigation" ref="navigation">
    <div
      class="tool-tip"
      ref="toolTip"
      :style="{ left: toolTipLeftPosition + 'px' }"
      v-if="toolTipShown"
    >
      {{ toolTipLocalName || servers[toolTipServerID].name }}
    </div>
    <div class="container" @mouseleave="mouseLeaveEvent">
      <div class="navigation-items">
        <div
          data-name="Explore" 
          class="item material-icons"
          :class="{ selected: currentTab == 0 }"
          @click="switchTab(0)"
          @mouseenter="localToolTipEvent('Explore', $event)"
        >
          explore
        </div>
        <div
          data-name="Direct Message" 
          class="item material-icons"
          :class="{
            selected: currentTab == 1,
            notifyAnimation: DMNotification || friendRequestExists
          }"
          @click="switchTab(1)"
          @mouseenter="localToolTipEvent('Direct Message', $event)"
        >
          chat
        </div>
        <div
          data-name="Servers" 
          class="item material-icons"
          :class="{
            selected: currentTab == 2,
            notifyAnimation: serverNotification
          }"
          @click="switchTab(2)"
          @mouseenter="localToolTipEvent('Servers', $event)"
        >
          forum
        </div>
        <div
          data-name="Changelog" 
          class="item material-icons"
          :class="{ selected: currentTab == 3 }"
          @click="switchTab(3)"
          @mouseenter="localToolTipEvent('Changelog', $event)"
        >
          import_contacts
        </div>
        <div
          v-if="!user.survey_completed"
          class="item material-icons"
          @click="openSurvey"
          @mouseenter="localToolTipEvent('Click Me', $event)"
        >
          error
        </div>
      </div>
    </div>
    <div
      data-name="Settings" 
      class="item material-icons"
      @click="openSettings"
      @mouseleave="mouseLeaveEvent"
      @mouseenter="localToolTipEvent('Settings', $event)"
    >
      settings
    </div>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import config from "@/config.js";
import settingsService from "@/services/settingsService";
import { isMobile } from "@/utils/Mobile";
export default {
  data() {
    return {
      avatarDomain: config.domain + "/avatars",
      toolTipShown: false,
      toolTipLeftPosition: 0,
      toolTipServerID: null,
      toolTipLocalName: null,
      mobile: isMobile(),

      drag: false
    };
  },
  methods: {
    async onEnd(event) {
      this.drag = false;
      const serverIDArr = this.serversArr.map(s => s.server_id);
      await settingsService.setServerPositions(serverIDArr);
    },
    onStart() {
      this.toolTipShown = false;
      this.drag = true;
      this.$store.dispatch("setAllPopout", { show: false });
    },
    dismissNotification(channelID) {
      const notifications = this.$store.getters.notifications.find(function(e) {
        return e.channelID === channelID;
      });

      if (notifications && notifications.count >= 1 && document.hasFocus()) {
        this.$socket.emit("notification:dismiss", { channelID });
      }
    },
    openServer(serverID) {
      const server = this.servers[serverID];
      const lastSelectedChannel = JSON.parse(
        localStorage.getItem("selectedChannels") || "{}"
      )[serverID];
      const defaultChannelID = server.default_channel_id;
      const channels = this.$store.getters.channels;
      let channel = channels[lastSelectedChannel || defaultChannelID];
      if (!channel) {
        channel = channels[defaultChannelID];
      }

      this.dismissNotification(channel.channelID);
      this.$store.dispatch("servers/setSelectedServerID", serverID);
      this.$store.dispatch("openChannel", channel);
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
    openSettings() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "settings",
        visibility: true
      });
    },
    localToolTipEvent(name, event) {
      this.toolTipLocalName = name;
      this.toolTipShown = true;

      this.$nextTick(() => {
        const width = window.innerWidth;
        const tooltipWidth = this.$refs.toolTip.clientWidth;
        const rect = event.target.getBoundingClientRect();
        this.toolTipLeftPosition = rect.left - tooltipWidth / 2 + 25;
      });
    },

    mouseLeaveEvent() {
      this.toolTipShown = false;
      this.toolTipServerID = null;
      this.toolTipLocalName = null;
    },
    addServer() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "addServer",
        visibility: true
      });
    },
    addFriend() {
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "ADD_FRIEND"
      });
    },
    openSurvey() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "surveyPopout",
        visibility: true
      });
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    currentTab() {
      return this.$store.getters.currentTab;
    },
    servers() {
      return this.$store.getters["servers/servers"];
    },
    serversArr: {
      get() {
        const data = this.servers;
        return Object.keys(data)
          .map(key => {
            return data[key];
          })
          .reverse();
      },
      set(value) {
        const reversedServers = value.reverse();
        // convert array to json
        const json = {};
        for (let index = 0; index < reversedServers.length; index++) {
          const element = reversedServers[index];
          json[element.server_id] = element;
        }
        this.$store.dispatch("servers/setServers", json);
      }
    },
    selectedServerID() {
      return this.$store.getters["servers/selectedServerID"];
    },
    serverNotification() {
      const notifications = this.$store.getters.notifications;
      const channels = this.$store.getters.channels;
      const notification = notifications.find(e => {
        return (
          channels[e.channelID] &&
          channels[e.channelID].server_id &&
          (e.channelID !== this.$store.getters.selectedChannelID ||
            !document.hasFocus() ||
            this.currentTab !== 2)
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
          (e.channelID !== this.$store.getters.selectedChannelID ||
            !document.hasFocus() ||
            this.currentTab !== 1)
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
    }
  }
};
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  flex-direction: row;
  flex-shrink: 0;
  height: 60px;
  width: 100%;
  position: relative;
}
.container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}
.navigation-items {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-self: flex-start;
  align-content: center;
  flex-shrink: 0;
}
.item {
  position: relative;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-content: center;
  align-items: center;
  color: white;
  font-size: 30px;
  align-self: center;
  width: 50px;
  height: 50px;
  margin-left: 10px;
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
  opacity: 0.8;
  transition: 0.2s;
  &:hover {
    background: #093b4b;
  }
  &.selected {
    background: #072c38;
  }
}

.notifyAnimation:before {
  content: "!";
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  font-size: 15px;
  position: absolute;
  z-index: 115651;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  animation: notifyAnime;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  border-radius: 50%;
  background: rgba(255, 23, 23, 0.753);
  flex-shrink: 0;
}
@keyframes notifyAnime {
  0% {
    opacity: 0.2;
  }
  40% {
    opacity: 1;
  }
  60% {
    opacity: 1;
  }
  100% {
    opacity: 0.2;
  }
}

.tool-tip {
  color: white;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  padding: 5px;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  top: 60px;
  z-index: 99999;
  user-select: none;
  cursor: default;
  transition: 0.2s;
}
</style>
