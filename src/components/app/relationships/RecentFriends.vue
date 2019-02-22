<template>
  <div class="recents">
    <transition name="list" appear>
      <div class="list">
        
        <FriendsTemplate v-for="(channel, key) of channels" :key="key" notifications="1" :channelID="channel.channelID" :uniqueID="channel.recipients[0].uniqueID" :username="channel.recipients[0].username" :tag="channel.recipients[0].tag"/>
      </div>
    </transition>
  </div>
</template>

<script>
import Tab from './Tab.vue'
import FriendsTemplate from './FriendsTemplate.vue'
export default {
  components: {
    FriendsTemplate
  },
  computed: {
    channels() {
      const json = this.$store.getters.channels;
      const notifications = this.$store.getters.notifications;

      const keys = Object.keys(json);
      let result = [];
      keys.forEach(function(key){
          result.push(json[key]);
      });

      result.sort(function(a, b){
        
        const notificationA = notifications.find(item => {
          return item.channelID === a.channelID
        })
        const notificationB = notifications.find(item => {
          return item.channelID === b.channelID
        })
        // make notifications more prority.
        if (notificationA)
          return -1
        if (notificationB)
          return 1

        if (a.lastMessaged === undefined)
          return 1
        if (b.lastMessaged === undefined)
          return -1
        return b.lastMessaged - a.lastMessaged
      });

      // gets unopened dms
      const notificationsFiltered = notifications.filter(item => {
        const find = result.find(resFind => {
          return resFind.channelID === item.channelID
        })
        if (!find) {
          return true;
        }
      })
      for (let index in notificationsFiltered){
        notificationsFiltered[index].creator = "dummy";
        notificationsFiltered[index].recipients = [notificationsFiltered[index].sender];
      }
      result = notificationsFiltered.concat(result)
      return result
    }
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

.recents{
  background-color: rgba(0, 0, 0, 0);
  margin: 5px;
  user-select: none;
  padding-bottom: 3px;
  border-radius: 5px;
  transition: 0.3s;
}
.tab{
  border-radius: 5px;
  transition: 0.3s;
}
.tab:hover{
  background-color: rgba(0, 0, 0, 0.123);
}
</style>


