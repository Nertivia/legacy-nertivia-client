<template>
  <div class="navigation" :class="{ mobile: mobileSize }" ref="navigation">
    <div
      class="tool-tip"
      ref="toolTip"
      :style="{ top: toolTipTopPosition + 'px' }"
      v-if="toolTipShown"
    >
      <div
        class="verified"
        v-if="
          !toolTipLocalName &&
            servers[toolTipServerID] &&
            servers[toolTipServerID].verified
        "
        :title="$t('verified-server')"
      >
        <span class="material-icons">check</span>
      </div>
      <div class="name">
        {{ toolTipLocalName || servers[toolTipServerID].name }}
      </div>
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
        @mouseenter="localToolTipEvent($t('add-friend'), $event)"
      >
        person_add
      </div>
      <div
        data-name="Add Server"
        class="item material-icons"
        @click="addServer"
        @mouseenter="localToolTipEvent($t('add-server'), $event)"
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
    openServer(serverID, channelID) {
      this.switchTab(2);
      const server = this.servers[serverID];
      const lastcurrentChannel = JSON.parse(
        localStorage.getItem("currentChannels") || "{}"
      )[serverID];
      const defaultChannelID = server.default_channel_id;
      const channels = this.$store.getters.channels;
      let channel =
        channels[channelID || lastcurrentChannel || defaultChannelID];
      if (!channel) {
        channel = channels[defaultChannelID];
      }
      this.$store.dispatch("servers/setcurrentServerID", serverID);
      this.$store.dispatch("openChannel", channel);
      this.$store.dispatch("currentChannelID", channel.channelID);
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
      this.toolTipShown = true;
      this.$nextTick(() => {
        this.toolTipTopPosition =
          rect.top -
          this.topHeight() +
          70 / 2 -
          this.$refs["toolTip"].clientHeight / 2;
      });
    },
    serverToolTipEvent({ serverID, top }) {
      if (this.drag) return;
      this.toolTipLocalName = null;
      this.toolTipServerID = serverID;
      this.toolTipShown = true;
      this.$nextTick(() => {
        this.toolTipTopPosition =
          top -
          this.topHeight() +
          55 / 2 -
          this.$refs["toolTip"].clientHeight / 2;
      });
    },
    topHeight() {
      return this.$refs["navigation"].getBoundingClientRect().top;
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
    },
    changeCurrentServerIndex(direction) {
      let index = this.serversArr.findIndex(
        s => s.server_id === this.currentServerID
      );
      if (!(index + 1)) index = -1;
      if (direction === "up") {
        index -= 1;
      }
      if (direction === "down") {
        index += 1;
      }
      if (!this.serversArr[index]) return;
      bus.$emit("openServer", this.serversArr[index].server_id);
    }
  },
  computed: {
    mobileSize() {
      return (
        this.$mq === "mobile" &&
        (this.currentTab === 0 ||
          this.currentTab === 1 ||
          this.currentTab === 2)
      );
    },
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
    currentServerID() {
      return this.$store.getters["servers/currentServerID"];
    }
  },
  mounted() {
    bus.$on("servers:changeCurrentIndex", this.changeCurrentServerIndex);
    bus.$on("server-tool-tip", this.serverToolTipEvent);
    bus.$on("openServer", this.openServer);
  },
  destroyed() {
    bus.$off("servers:changeCurrentIndex", this.changeCurrentServerIndex);
    bus.$off("server-tool-tip", this.serverToolTipEvent);
    bus.$off("openServer", this.openServer);
  }
};
</script>

<style lang="scss" scoped>
.flip-list-move {
  transition: 0.3s;
}

.verified {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #267dff;
  border-radius: 50%;
  right: 0px;
  bottom: 0px;
  user-select: none;
  margin-right: 5px;
  flex-shrink: 0;
  .material-icons {
    color: #ffffff;
    font-size: 12px;
  }
}

.ghost {
  opacity: 0;
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
  color: rgba(255, 255, 255, 0.6);
  font-size: 30px;
  align-self: center;
  width: 70px;
  height: 70px;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  &:hover {
    color: white;
  }
  &.selected {
    color: white;
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
  display: flex;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  padding: 5px;
  border-radius: 4px;
  max-width: 150px;

  left: 70px;
  z-index: 99999;
  user-select: none;
  cursor: default;
  transition: 0.2s;
  .name {
  }
}
</style>
