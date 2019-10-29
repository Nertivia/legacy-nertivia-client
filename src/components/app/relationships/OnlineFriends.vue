<template>
  <div class="friends">
    <div
      class="tab"
      @click="expanded = !expanded"
    >
      <Tab
        :expanded="expanded"
        tabname="Online"
      />
    </div>
    <transition name="list">
      <div
        v-if="expanded"
        class="list"
      >
        <FriendsTemplate
          v-for="(friend, key) of friends"
          :key="key"
          :channel-i-d="friend.channelID"
          :recipient="friends[key].recipient"
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Tab from './Tab.vue'
import FriendsTemplate from './FriendsTemplate.vue'
export default {
  components: {
    Tab,
    FriendsTemplate
  },
  data() {
    return {
      expanded: true
    } 
  },
  computed: {
    friends() {
      const allFriend = this.$store.getters.user.friends;
      const members = this.$store.getters['members/members'];
      const presences = this.$store.getters['members/presences'];
      const notifications = this.$store.getters.notifications;
      const channels = this.$store.getters.channels;

      const result = Object.keys(allFriend).map(function(key) {
        const friend = allFriend[key]; 
        friend.recipient = members[friend.uniqueID];

        const findNotification = notifications.find( e => {
          return e.sender.uniqueID === friend.recipient.uniqueID && !channels[e.channelID].server_id
        })
        
        if ( findNotification ){
          friend.channelID = findNotification.channelID;
        }

        return friend
      });
      return result.filter(friend => friend.status == 2 && (presences[friend.uniqueID] && presences[friend.uniqueID] > 0 ));
    }
  },
  methods: {

  }
}
</script>
<style scoped>
.list-enter-active, .list-leave-active {
  transition:  .3s;
}
.list-enter, .list-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(-20px);
  opacity: 0;
}

.friends{
  background-color: rgba(0, 0, 0, 0);
  user-select: none;
  padding-bottom: 3px;
  transition: 0.3s;
}
.tab{
  transition: 0.3s;
}
.tab:hover{
  background-color: rgba(0, 0, 0, 0.123);
}
</style>


