<template>
  <div class="left-panel">
    <MyMiniInformation />
    <div class="tabs">
      <div :class="{selector: true, right: currentTab === 1}" />
      <div
        class="tab"
        @click="currentTab = 0"
      >
        Friends
      </div>
      <div
        class="tab"
        :class="{notifyAnimation: DMNotification}"
        @click="currentTab = 1"
      >
        Recents
      </div>
    </div>
    <div
      v-if="currentTab === 0"
      class="list"
    >
      <pending-friends />
      <online-friends />
      <offline-friends />
    </div>
    <div
      v-else
      class="list"
    >
      <recent-friends />
    </div>
    <AddFriendPanel />
  </div>
</template>

<script>

import MyMiniInformation from '../../components/app/MyMiniInformation.vue'
import PendingFriends from './relationships/PendingFriends.vue'
import AddFriendPanel from './relationships/AddFriendPanel.vue'
import OnlineFriends from './relationships/OnlineFriends.vue'
import OfflineFriends from './relationships/OfflineFriends.vue'
import RecentFriends from './relationships/RecentFriends.vue'


export default {
  components: {
    MyMiniInformation,
    PendingFriends,
    AddFriendPanel,
    OnlineFriends,
    OfflineFriends,
    RecentFriends
  },
  data() {
    return {
      currentTab:  0
    }
  },
  watch: {
    currentTab(tab) {
      localStorage.setItem('friendsListTab', tab)
    }
  },
  mounted() {
    const tab = localStorage.getItem('friendsListTab');
    if (tab) {
      this.currentTab = parseInt(tab)
    }
  },
  computed: {
    DMNotification() {
      const notifications = this.$store.getters.notifications;
      const channels = this.$store.getters.channels
      const notification = notifications.find(e => {
        return channels[e.channelID] && !channels[e.channelID].server_id
      })
      // unopened dm
      if (!notification) {
        return notifications.find(e => {
          return !channels[e.channelID]
        })
      }
      return notification;
    },
  }
}
</script>
<style scoped>

.left-panel {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.671);
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;
}
.list{
  margin: 2px;
  margin-left: 5px;
  margin-right: 5px;
  flex: 1;
  overflow: auto;
}

.tabs{
  display: flex;
  color: white;
  flex-shrink: 0;
  margin-top: 10px;
  position: relative;
}
.tab{
  flex: 1;
  text-align: center;
  margin: auto;
  flex-shrink: 0;
  user-select: none;
  cursor: default;
  padding: 10px;
  background: rgba(0, 0, 0, 0.171);
  margin-left: 1px;
  margin-right: 1px;
  border-radius: 5px;
  transition: 0.3s;
}
.tab:hover{
  background: rgba(255, 255, 255, 0.096);
}
.selector {
  background: rgba(255, 255, 255, 0.322);
  width: 148px;
  height: 39px;
  top: 0;
  left: 1px;
  position: absolute;
  z-index: -1;
  transition: 0.3s;
  border-radius: 5px;
}
.right{
  transform: translateX(150px);
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

.notifyAnimation{
  animation: notifyAnime;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
}
@keyframes notifyAnime {
  0%{
    background: rgba(121, 3, 3, 0.541);
  }
  40%{
    background: rgba(255, 0, 0, 0.568);
  }
  60%{
    background: rgba(255, 0, 0, 0.568);
  }
  100%{
    background: rgba(121, 3, 3, 0.541);
  }
}
</style>
