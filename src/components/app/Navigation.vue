<template>
  <div class="navigation" ref="navigation">
    <div
      class="tool-tip"
      ref="toolTip"
      :style="{top: toolTipTopPosition + 'px'}"
      v-if="toolTipShown"
    >{{toolTipLocalName || servers[toolTipServerID].name}}</div>
    <div class="container" @mouseleave="mouseLeaveEvent">
      <div class="scrollable">
        <div class="navigation-items">
          <div
            class="item material-icons"
            :class="{selected: currentTab == 0}"
            @click="switchTab(0)"
            @mouseenter="localToolTipEvent('Explore', $event)"
          >explore</div>
          <div
            class="item material-icons"
            :class="{selected: currentTab == 1, notifyAnimation: DMNotification || friendRequestExists}"
            @click="switchTab(1)"
            @mouseenter="localToolTipEvent('Direct Message', $event)"
          >chat</div>
          <div
            class="item material-icons"
            :class="{selected: currentTab == 2, notifyAnimation: serverNotification}"
            @click="switchTab(2)"
            @mouseenter="localToolTipEvent('Servers', $event)"
          >forum</div>
          <div
            class="item material-icons"
            :class="{selected: currentTab == 3}"
            @click="switchTab(3)"
            @mouseenter="localToolTipEvent('Changelog', $event)"
          >list_alt</div>
          <div
            v-if="!user.survey_completed"
            class="item material-icons"
            @click="openSurvey"
            @mouseenter="localToolTipEvent('Click Me', $event)"
          >error</div>
        </div>
        <div class="seperater" />

        <div class="server-items" v-if="currentTab === 2">
          <draggable v-model="serversArr" :animation="200" :delay="mobile ? 400 : 0" ghost-class="ghost" @end="onEnd" @start="onStart">
            <transition-group type="transition" :name="!drag ? 'flip-list' : null">
              <server-template
                class="sortable"
                v-for="(data) in serversArr"
                :serverData="data"
                @click.native="openServer(data.server_id)"
                :key="data.server_id"
              />
            </transition-group>
          </draggable>

        </div>

      </div>
      <div class="seperater" />
      <div
        class="item material-icons"
        v-if="currentTab === 1"
        @click="addFriend"
        @mouseenter="localToolTipEvent('Add Friend', $event)"
      >person_add</div>
      <div
        class="item material-icons"
        v-if="currentTab === 2"
        @click="addServer"
        @mouseenter="localToolTipEvent('Add Server', $event)"
      >add</div>
      <div
        class="item material-icons"
        @click="openSettings"
        @mouseenter="localToolTipEvent('Settings', $event)"
      >settings</div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import config from "@/config.js";
import settingsService from '@/services/settingsService';
import ServerTemplate from "@/components/app/ServerTemplate/ServerTemplate";
import draggable from 'vuedraggable'
import { isMobile } from "@/utils/Mobile";
export default {
  components: { ServerTemplate, draggable },
  data() {
    return {
      avatarDomain: config.domain + "/avatars",
      toolTipShown: false,
      toolTipTopPosition: 0,
      toolTipServerID: null,
      toolTipLocalName: null,
      mobile: isMobile(),

      drag: false,
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
      this.$store.dispatch("setAllPopout", {show: false});
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
      const rect = event.target.getBoundingClientRect();
      this.toolTipLocalName = name;
      this.toolTipTopPosition = rect.top - this.getTopHeight() + 16;
      this.toolTipShown = true;
    },
    serverToolTipEvent({ serverID, top }) {
      if (this.drag) return;
      this.toolTipLocalName = null;
      this.toolTipServerID = serverID;
      this.toolTipTopPosition = top - this.getTopHeight() + 16;
      this.toolTipShown = true;
    },
    mouseLeaveEvent() {
      this.toolTipShown = false;
      this.toolTipServerID = null;
      this.toolTipLocalName = null;
    },
    getTopHeight() {
      return window.innerHeight - this.$refs["navigation"].offsetHeight;
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
        const reversedServers = value.reverse()
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
  },
  mounted() {
    bus.$on("server-tool-tip", this.serverToolTipEvent);
  },
  destroyed() {
    bus.$off("server-tool-tip", this.serverToolTipEvent);
  }
};
</script>


<style lang="scss" scoped>

.flip-list-move {
  transition: 0.3s;
}
.sortable-drag {
  opacity: 0;
}
.ghost::before {
  content: '';
  position: absolute;
  background: white;
  top: 0;
  left: 0;
  bottom: 0;
  width: 3px;
}

.navigation {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
  width: 60px;
  background-color: #085053;
}

.container {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
  width: 60px;
}
.navigation-items {
  display: flex;
  flex-direction: column;
  width: 100%;
  align-self: flex-start;
  align-content: center;
  flex-shrink: 0;
}
.scrollable {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  overflow-y: auto;
  scrollbar-width: none;
  height: 100%;
  align-self: center;
  &::-webkit-scrollbar {
    width: 0px;
  }
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
  width: 60px;
  height: 60px;
  cursor: pointer;
  user-select: none;
  opacity: 0.8;
  transition: 0.2s;
  &:hover {
    background: #074447;
  }
  &.selected {
    background: #042a2b;
  }
}

.server-items {
  display: flex;
  flex-direction: column;
}

.seperater {
  background-color: #d8d8d8;
  flex-shrink: 0;
  align-self: center;
  width: calc(100% - 10px);
  height: 2px;
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
  left: 60px;
  z-index: 99999;
  user-select: none;
  cursor: default;
  transition: 0.2s;
}
</style>