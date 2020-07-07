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
          @mouseenter="localToolTipEvent($t('explore'), $event)"
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
      <!-- <div
        data-name="profile"
        class="item settings"
        @click="openSettings"
        @mouseleave="mouseLeaveEvent"
        @mouseenter="localToolTipEvent(`${user.username}:${user.tag}`, $event)"
      >
        <div
          class="status-avatar"
          :style="`border: solid 3px ${getStatusColor}`"
        >
          <img class="avatar" :src="avatarDomain + '/' + user.avatar" />
        </div>
      </div> -->

      <div
        data-name="Settings"
        class="item material-icons settings"
        @click="openSettings"
        @mouseleave="mouseLeaveEvent"
        @mouseenter="localToolTipEvent('Settings', $event)"
      >
        settings
      </div>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main.js";
import config from "@/config.js";
import settingsService from "@/services/settingsService";
import { isMobile } from "@/utils/Mobile";
import statuses from "@/utils/statuses";
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
  mounted() {
    bus.$on('channels:changeCurrentIndex', this.changeCurrentChannelIndex);
  },
  destroyed() {
    bus.$off('channels:changeCurrentIndex', this.changeCurrentChannelIndex);
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
    openServer(serverID) {
      const server = this.servers[serverID];
      const lastcurrentChannel = JSON.parse(
        localStorage.getItem("currentChannels") || "{}"
      )[serverID];
      const defaultChannelID = server.default_channel_id;
      const channels = this.$store.getters.channels;
      let channel = channels[lastcurrentChannel || defaultChannelID];
      if (!channel) {
        channel = channels[defaultChannelID];
      }

      this.$store.dispatch("servers/setcurrentServerID", serverID);
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
    },
    changeCurrentChannelIndex(direction) {
      let index = this.currentTab;
      if (direction === "left") {
        if (!index) return;
        index -= 1;
      }
      if (direction === "right") {
        if (index >= 4) return;
        index += 1;
      }
      this.switchTab(index);
    }
  },
  computed: {
    getStatusColor() {
      const status = this.$store.getters.user.status || 0;
      return statuses[parseInt(status)].color;
    },
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
    currentServerID() {
      return this.$store.getters["servers/currentServerID"];
    },
    serverNotification() {
      const notifications = this.$store.getters.notifications;
      const channels = this.$store.getters.channels;
      const notificationsFiltered = notifications.filter(e => {
        return (
          channels[e.channelID] &&
          channels[e.channelID].server_id &&
          (e.channelID !== this.$store.getters.currentChannelID ||
            !document.hasFocus() ||
            this.currentTab !== 2)
        );
      });
      const mentioned = notificationsFiltered.find(m => m.mentioned);
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
          (e.channelID !== this.$store.getters.currentChannelID ||
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
  background: rgba(0, 0, 0, 0.4);

  width: initial;
  .item {
    width: 40px;
    height: 40px;
    margin-left: 5px;
    margin-right: 5px;
    font-size: 25px;
  }
  .tool-tip {
    top: -29px;
  }
}

.status-avatar {
  height: 30px;
  width: 30px;
  border-radius: 50%;
  .avatar {
    height: 30px;
    width: 30px;
    border-radius: 50%;
    object-fit: cover;
  }
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.settings {
  margin-right: 14px;
}

.container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  overflow: auto;
}
.container {
  scrollbar-width: thin;
}
.container::-webkit-scrollbar {
  height: 3px;
}

.navigation-items {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-self: flex-start;
  align-content: center;
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
  color: rgba(255, 255, 255, 0.6);
  align-self: center;
  border-radius: 50%;
  cursor: pointer;
  user-select: none;
  transition: 0.2s;
  &:hover {
    color: white;
    // background: rgba(0, 0, 0, 0.3);
  }
  &.selected {
    color: white;
    // background: rgba(0, 0, 0, 0.3);
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
