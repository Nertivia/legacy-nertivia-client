<template>
  <div class="left-panel">
    <navigation />
    <div class="content">
      <div class="tabs">
        <div :class="{selector: true, right: currentTab === 1}" />
        <div
          class="tab"
          :class="{notifyAnimation: friendRequestExists}"
          @click="currentTab = 0"
        >Friends</div>
        <div class="tab" :class="{notifyAnimation: DMNotification}" @click="currentTab = 1">Recents</div>
      </div>
      <div v-if="currentTab === 0" class="list">
        <pending-friends />
        <online-friends />
        <offline-friends />
      </div>
      <div v-else class="list">
        <recent-friends />
      </div>
      <MyMiniInformation />
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
  mounted() {
    const tab = localStorage.getItem("friendsListTab");
    if (tab) {
      this.currentTab = parseInt(tab);
    }
  },
  computed: {
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
    }
  }
};
</script>
<style scoped>
.left-panel {
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  width: 300px;
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
  background: rgba(0, 0, 0, 0.171);
  margin-left: 1px;
  margin-right: 1px;
  transition: 0.3s;
  cursor: pointer;
}
.tab:hover {
  background: rgba(255, 255, 255, 0.096);
}
.selector {
  background: rgba(255, 255, 255, 0.322);
  width: 118px;
  height: 50px;
  top: 0;
  left: 1px;
  position: absolute;
  z-index: -1;
  transition: 0.3s;
}
.right {
  transform: translateX(120px);
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

.notifyAnimation {
  animation: notifyAnime;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
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
</style>
