<template>
  <div class="left-panel">
    <navigation />
    <div class="content">
      <MyMiniInformation />
      <div class="tabs">
        <div
          class="tab"
          :class="{ notify: friendRequestExists, selected: currentTab === 0 }"
          @click="currentTab = 0"
        >
          <div class="material-icons">group</div>
          Friends
        </div>
        <div
          class="tab"
          :class="{ notify: DMNotification, selected: currentTab === 1 }"
          @click="currentTab = 1"
        >
          <div class="material-icons">access_time</div>
          Recents
        </div>
      </div>
      <div v-if="currentTab === 0" class="list">
        <pending-friends />
        <online-friends />
        <offline-friends />
      </div>
      <div v-else class="list">
        <recent-friends />
      </div>
      <div
        class="button"
        :class="{ selected: uniqueIDSelected }"
        @click="saveNotesBtn"
      >
        <div class="material-icons">notes</div>
        <div class="name">Saved Notes</div>
      </div>
    </div>
  </div>
</template>

<script>
import MyMiniInformation from "../../components/app/MyMiniInformation.vue";
import PendingFriends from "./relationships/PendingFriends.vue";
import OnlineFriends from "./relationships/OnlineFriends.vue";
import OfflineFriends from "./relationships/OfflineFriends.vue";
import RecentFriends from "./relationships/RecentFriends.vue";
import Navigation from "@/components/app/Navigation";

export default {
  components: {
    MyMiniInformation,
    PendingFriends,
    OnlineFriends,
    OfflineFriends,
    RecentFriends,
    Navigation
  },
  data() {
    return {
      currentTab: 0
    };
  },
  watch: {
    currentTab(tab) {
      localStorage.setItem("friendsListTab", tab);
    }
  },
  methods: {
    saveNotesBtn() {
      this.$store.dispatch("openChat", {
        uniqueID: this.user.uniqueID,
        channelName: "Saved Notes"
      });
    }
  },
  mounted() {
    const tab = localStorage.getItem("friendsListTab");
    if (tab) {
      this.currentTab = parseInt(tab);
    }
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    uniqueIDSelected() {
      return this.$store.getters.selectedUserUniqueID === this.user.uniqueID;
    },
    DMNotification() {
      const notifications = this.$store.getters.notifications;
      const channels = this.$store.getters.channels;
      const notification = notifications.find(e => {
        return (
          channels[e.channelID] &&
          !channels[e.channelID].server_id &&
          (e.channelID !== this.$store.getters.selectedChannelID ||
            !document.hasFocus())
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
<style scoped lang="scss">
.left-panel {
  height: 100%;
  width: 340px;
  max-width: calc(100% - 60px);
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  z-index: 1;
}
.content {
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  flex: 1;
  overflow: hidden;
  background: rgba(0, 0, 0, 0.14);
  border-top-left-radius: 10px;
}
.list {
  flex: 1;
  overflow: auto;
}

.tabs {
  display: flex;
  color: white;
  flex-shrink: 0;
  position: relative;
  background: rgba(0, 0, 0, 0.2);
}
.tab {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  margin: auto;
  flex-shrink: 0;
  user-select: none;
  cursor: default;
  height: 50px;
  transition: 0.2s;
  cursor: pointer;
  position: relative;
}
.tab .material-icons {
  margin-right: 5px;
}
.tab:hover::before {
  content: "";
  position: absolute;
  height: 3px;
  left: 10px;
  right: 10px;
  bottom: 0;
  background: rgba(255, 255, 255, 0.4);
}
.tab::before {
  content: "";
  position: absolute;
  height: 3px;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent;
  transition: 0.2s;
}
.tab.selected::before {
  content: "";
  position: absolute;
  height: 3px;
  left: 10px;
  right: 10px;
  bottom: 0;
  background: rgb(255, 255, 255);
}

.button {
  color: white;
  display: flex;
  align-content: center;
  align-items: center;
  padding: 5px;
  justify-content: center;
  flex-shrink: 0;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
  transition: 0.2s;
  .material-icons {
    margin-right: 5px;
  }
  &:hover {
    background: rgba(0, 0, 0, 0.4);
  }
  &.selected {
    background: rgba(0, 0, 0, 0.6);
  }
}

/* ------- SCROLL BAR -------*/
/* width */
.list::-webkit-scrollbar {
  width: 3px;
}

/* Track */
.list::-webkit-scrollbar-track {
  background: #8080806b;
}

/* Handle */
.list::-webkit-scrollbar-thumb {
  background: #f5f5f559;
}

/* Handle on hover */
.list::-webkit-scrollbar-thumb:hover {
  background: #f5f5f59e;
}

.seperater {
  height: 1px;
  width: calc(100% - 10px);
  align-self: center;
  background-color: #a0c8d5;
  flex-shrink: 0;
}

.notify {
  background: #ee3e34;
}

@media (max-width: 600px) {
  .content {
    border-radius: 0;
  }
}
</style>
