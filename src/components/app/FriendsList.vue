<template>
  <div class="friend-left-panel">
    <div
      class="button saved-notes-button"
      :class="{ selected: uniqueIDSelected }"
      @click="saveNotesBtn"
    >
      <div class="material-icons">notes</div>
      <div class="name">{{ $t("saved-notes") }}</div>
    </div>
    <div class="tabs">
      <div
        class="tab"
        :class="{ notify: friendRequestExists, selected: currentTab === 0 }"
        @click="currentTab = 0"
      >
        <div class="material-icons">group</div>
        {{ $t("friends") }}
      </div>
      <div
        class="tab"
        :class="{ notify: DMNotification, selected: currentTab === 1 }"
        @click="currentTab = 1"
      >
        <div class="material-icons">access_time</div>
        {{ $t("recents") }}
      </div>
    </div>
    <div class="list">
      <transition name="fade" mode="out-in">
        <friends-tab v-if="currentTab === 0" />
        <recent-friends-tab v-else />
      </transition>
    </div>
  </div>
</template>

<script>
import RecentFriendsTab from "./relationships/RecentFriendsTab.vue";
import FriendsTab from "./relationships/FriendsTab.vue";

export default {
  components: {
    FriendsTab,
    RecentFriendsTab
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
          (e.channelID !== this.$store.getters.currentChannelID ||
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
.friend-left-panel {
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;
  flex: 1;
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.list {
  flex: 1;
  overflow: auto;
}

.tabs {
  display: flex;
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
  position: relative;
  margin-top: 5px;
  margin-bottom: 10px;
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
  font-size: 14px;
  user-select: none;
  cursor: default;
  height: 30px;
  transition: 0.2s;
  cursor: pointer;
  margin-left: 5px;
  margin-right: 5px;
  position: relative;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
}
.tab:hover {
  color: white;
}
.tab.selected {
  color: white;
  background: rgb(0, 163, 90);
  background: linear-gradient(
    90deg,
    rgba(0, 163, 90, 1) 0%,
    rgba(0, 173, 159, 1) 100%
  );
  box-shadow: 0px 0px 5px 1px rgba(0, 163, 90, 1);
}

.tab .material-icons {
  margin-right: 5px;
}

.button {
  color: white;
  display: flex;
  align-content: center;
  align-items: center;
  padding: 5px;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  transition: 0.2s;
  .material-icons {
    margin-right: 5px;
  }
}
.saved-notes-button {
  border-radius: 5px;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.1);
  margin: 5px;
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.2);
  }
  &.selected {
    color: white;
    background: rgb(188, 0, 255);
    background: linear-gradient(
      90deg,
      rgba(188, 0, 255, 1) 0%,
      rgba(0, 164, 255, 1) 100%
    );
    box-shadow: 0px 0px 5px 1px rgba(0, 166, 255, 0.63);
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
</style>
