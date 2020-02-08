<template>
  <div class="navigation" ref="navigation">
    <div
      class="tool-tip"
      ref="toolTip"
      :style="{ top: toolTipTopPosition + 'px' }"
      v-if="toolTipShown"
    >
      {{ toolTipLocalName || servers[toolTipServerID].name }}
    </div>
    <div class="container" @mouseleave="mouseLeaveEvent">
      <div class="scrollable">
        <div class="server-items">
          <draggable
            v-model="serversArr"
            :animation="200"
            :delay="mobile ? 400 : 0"
            ghost-class="ghost"
            @end="onEnd"
            @start="onStart"
          >
            <transition-group
              type="transition"
              :name="!drag ? 'flip-list' : null"
            >
              <server-template
                class="sortable"
                v-for="data in serversArr"
                :serverData="data"
                @click.native="openServer(data.server_id)"
                :key="data.server_id"
              />
            </transition-group>
          </draggable>
        </div>
      </div>
      <div
        data-name="Add Friend"
        class="item material-icons"
        @click="addFriend"
        @mouseenter="localToolTipEvent('Add Friend', $event)"
      >
        person_add
      </div>
      <div
        data-name="Add Server"
        class="item material-icons"
        @click="addServer"
        @mouseenter="localToolTipEvent('Add Server', $event)"
      >
        add
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import config from "@/config.js";
import settingsService from "@/services/settingsService";
import ServerTemplate from "@/components/app/ServerTemplate/ServerTemplate";
import draggable from "vuedraggable";
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

      drag: false
    };
  },
  methods: {
    async onEnd() {
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
        this.$socket.client.emit("notification:dismiss", { channelID });
      }
    },
    openServer(serverID) {
      this.switchTab(2);
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
      this.$store.dispatch("selectedChannelID", channel.channelID);
    },
    switchTab(index) {
      bus.$emit("tab:switch", index);
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
      this.toolTipTopPosition = top - this.getTopHeight() + 20;
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
  content: "";
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
  width: 70px;
}

.container {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  height: 100%;
  width: 70px;
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
  width: 70px;
  height: 70px;
  cursor: pointer;
  user-select: none;
  opacity: 0.8;
  transition: 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
  &.selected {
    background: rgba(0, 0, 0, 0.2);
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

.tool-tip {
  color: white;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  padding: 5px;
  border-radius: 4px;
  max-width: 150px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  left: 70px;
  z-index: 99999;
  user-select: none;
  cursor: default;
  transition: 0.2s;
}

@media (max-width: 600px) {
  .navigation {
    background: #005a9e;
  }
}
</style>
