<template>
  <div class="main navigation" :class="{ mobile: mobileSize }" ref="navigation">
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
          forum
        </div>
        <div
          data-name="Servers"
          class="item material-icons"
          :class="{
            selected: currentTab == 2,
            notifyAnimation: serverNotification.notification,
            mentioned: serverNotification.mentioned
          }"
          @click="switchTab(2)"
          @mouseenter="localToolTipEvent('Servers', $event)"
        >
          dns
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
          data-name="Click Me"
          v-if="!user.survey_completed"
          class="item material-icons"
          @click="openSurvey"
          @mouseenter="localToolTipEvent('Click Me', $event)"
        >
          error
        </div>
        <div
          v-if="isAdmin"
          class="item material-icons"
          :class="{ selected: currentTab == 4 }"
          @click="switchTab(4)"
          @mouseenter="localToolTipEvent('Admin Panel', $event)"
        >
          security
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
        this.$socket.client.client.emit("notification:dismiss", { channelID });
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
      this.toolTipLocalName = name;
      this.toolTipShown = true;

      this.$nextTick(() => {
        const tooltipWidth = this.$refs.toolTip.clientWidth;
        const rect = event.target.getBoundingClientRect();
        if (this.mobileSize) {
          this.toolTipLeftPosition = rect.left - tooltipWidth / 2 + 20;
        } else {
          this.toolTipLeftPosition = rect.left - tooltipWidth / 2 + 25;
        }
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
    isAdmin() {
      return this.user.admin === 3 || this.user.admin === 4;
    },
    currentTab() {
      return this.$store.getters.currentTab;
    },
    selectedServerID() {
      return this.$store.getters["servers/selectedServerID"];
    },
    serverNotification() {
      const notifications = this.$store.getters.notifications;
      const channels = this.$store.getters.channels;
      const notificationsFiltered = notifications.filter(e => {
        return (
          channels[e.channelID] &&
          channels[e.channelID].server_id &&
          (e.channelID !== this.$store.getters.selectedChannelID ||
            !document.hasFocus() ||
            this.currentTab !== 2)
        );
      });
      const mentioned = notifications.find(m => m.mentioned);
      return {
        notification: !!notificationsFiltered.length,
        mentioned: !!mentioned
      };
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
.mobile {
  background: #005a9e;
  padding-left: 10px;
  width: initial;
  .item {
    width: 40px;
    height: 40px;
    margin-left: 5px;
    margin-right: 5px;
    font-size: 25px;
  }
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
  font-size: 24px;
  width: 48px;
  height: 48px;
  margin-left: 14px;
  position: relative;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-content: center;
  align-items: center;
  color: white;
  align-self: center;
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.3);
  }
  &.selected {
    background: rgba(0, 0, 0, 0.3);
  }
}

.notifyAnimation:before {
  content: "!";
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  font-size: 14px;
  font-weight: bold;
  position: absolute;
  z-index: 115651;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6947;
  flex-shrink: 0;
}
.mentioned:before {
  content: "@";
  margin-bottom: 10px;
  font-size: 13px;
  background: #ee3e34;
}
.tool-tip {
  color: white;
  position: absolute;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(3px);
  border-radius: 4px;
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
