<template>
  <div class="left-panel">
    <MyMiniInformation />
    <div class="list">
      <PendingFriends />
      <online-friends />
      <offline-friends />
    </div>
    <AddFriendPanel/>
  </div>
</template>

<script>

import MyMiniInformation from '../../components/app/MyMiniInformation.vue'
import PendingFriends from './relationships/PendingFriends.vue'
import AddFriendPanel from './relationships/AddFriendPanel.vue'
import OnlineFriends from './relationships/OnlineFriends.vue'
import OfflineFriends from './relationships/OfflineFriends.vue'
export default {
  components: {
    MyMiniInformation,
    PendingFriends,
    AddFriendPanel,
    OnlineFriends,
    OfflineFriends
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
  flex-direction: column
}
.list{
  margin: 10px;
  flex: 1;
  overflow: auto;
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
</style>
