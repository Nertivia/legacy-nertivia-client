<template>
  <div class="heading">
    <div
      class="show-menu-button"
      :class="{
        notifyAnimation: serverNotification.notification || friendRequestExists,
        mentioned: serverNotification.mentioned
      }"
      @click="toggleLeftMenu"
    >
      <i class="material-icons">menu</i>
    </div>
    <div
      v-if="type === 1"
      class="user-status"
      :style="
        `box-shadow: 0px 0px 14px 3px ${userStatusColor}; background-color: ${userStatusColor};`
      "
    />
    <div class="information">
      <div
        :class="{ name: true, clickable: !!uniqueID }"
        @click="openUserInfoPanel"
      >
        {{ name }}
      </div>
    </div>
    <div
      v-if="type === 2 && currentServerID"
      class="show-members-button"
      @click="toggleMembersPanel"
    >
      <i class="material-icons">view_list</i>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main";
import statuses from "@/utils/statuses";
export default {
  props: [
    "type", // 0: without online status; 1: with online status; 2: server.
    "name",
    "uniqueID"
  ],

  methods: {
    openUserInfoPanel() {
      if (this.uniqueID)
        this.$store.dispatch("setUserInformationPopout", this.uniqueID);
    },
    toggleLeftMenu() {
      bus.$emit("toggleLeftMenu");
    },
    toggleMembersPanel() {
      bus.$emit("toggleMembersPanel");
    }
  },
  computed: {
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
    },
    currentServerID() {
      return this.$store.getters["servers/currentServerID"];
    },
    userStatusColor() {
      const currentChannel = this.$store.getters.currentChannelID;
      const channel = this.$store.getters.channels[currentChannel];
      const presences = this.$store.getters["members/presences"];

      let status = presences[channel.recipients[0].uniqueID] || 0;
      return statuses[status].color;
    }
  }
};
</script>

<style scoped>
.notifyAnimation:before {
  content: "!";
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  font-size: 11px;
  font-weight: bold;
  position: absolute;
  z-index: 115651;
  bottom: 4px;
  left: 10px;
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background: #ff6947;
  flex-shrink: 0;
  margin-bottom: 10px;
}

.mentioned:before {
  content: "@";
  font-size: 10px;
  background: #ee3e34;
}

.heading {
  background: rgba(73, 131, 219, 0.71);
  box-shadow: 0px 0px 5px 1px rgb(0, 0, 0);
  border-radius: 5px;
  backdrop-filter: blur(4px);
  margin-bottom: 0;
  height: 40px;
  display: flex;
  flex-shrink: 0;
  padding-left: 10px;
  align-items: center;
  position: absolute;
  margin: 5px;
  left: 0;
  right: 0;
  z-index: 2;
}
@supports (
  (-webkit-backdrop-filter: blur(4px)) or (backdrop-filter: blur(4px))
) {
  .heading {
    background: rgba(73, 131, 219, 0.71);
    backdrop-filter: blur(10px);
  }
}
.show-menu-button {
  display: inline-block;
  margin-right: 5px;
  margin-top: 3px;
  user-select: none;
  display: none;
  cursor: pointer;
  position: relative;
}
.show-members-button {
  display: inline-block;
  margin-right: 5px;
  margin-top: 3px;
  user-select: none;
  display: none;
  color: white;
  cursor: pointer;
}
.show-menu-button .material-icons {
  color: rgb(207, 207, 207);
  transition: 0.3s;
}
.show-menu-button .material-icons:hover {
  color: rgb(255, 255, 255);
}
.information {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.name {
  color: white;
  font-size: 20px;
  width: 10px;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-status {
  border-radius: 4px;
  height: 10px;
  width: 10px;
  margin-right: 10px;
  margin-left: 5px;
  flex-shrink: 0;
  transition: background-color 0.2s, box-shadow 0.2s;
}
.clickable {
  color: rgba(255, 255, 255, 0.9);
  transition: 0.2s;
  cursor: pointer;
}
.clickable:hover {
  color: white;
}

@media (max-width: 949px) {
  .show-members-button {
    display: block;
  }
}

@media (max-width: 600px) {
  .show-menu-button {
    display: block;
  }
}
</style>
