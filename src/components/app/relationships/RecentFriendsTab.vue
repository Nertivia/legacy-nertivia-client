<template>
  <div class="recents">
    <virtual-list :size="50" :remain="20" v-if="loaded" >
      <FriendsTemplate
        v-for="(channel, key) of channels"
        :key="key"
        :recents="true"
        :friend="channel"
        :recipient="channel.recipients[0]"
      />
    </virtual-list>
  </div>
</template>

<script>
import VirtualList from "vue-virtual-scroll-list";
import FriendsTemplate from "./FriendsTemplate.vue";
export default {
  components: {
    FriendsTemplate,
    VirtualList
  },
  data() {
    return {
      loaded: false
    };
  },
  mounted() {
    setTimeout(() => (this.loaded = true));
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    channels() {
      const json = this.$store.getters.channels;
      const notifications = this.$store.getters.notifications;

      const keys = Object.keys(json);
      let result = [];
      keys.forEach(key => {
        if (
          json[key].recipients &&
          json[key].recipients.length > 0 &&
          !json[key].server_id &&
          json[key].recipients[0].uniqueID !== this.user.uniqueID
        )
          result.push(json[key]);
      });

      result.sort(function(a, b) {
        const notificationA = notifications.find(item => {
          return item.channelID === a.channelID;
        });
        const notificationB = notifications.find(item => {
          return item.channelID === b.channelID;
        });
        // make notifications more prority.
        if (notificationA) return -1;
        if (notificationB) return 1;
        if (a.lastMessaged === undefined) return 1;
        if (b.lastMessaged === undefined) return -1;
        return b.lastMessaged - a.lastMessaged;
      });

      // gets unopened dms
      const notificationsFiltered = notifications.filter(item => {
        if (json[item.channelID] && json[item.channelID].server_id) return;
        const find = result.find(resFind => {
          return resFind.channelID === item.channelID;
        });
        if (!find) {
          return true;
        }
      });
      for (let index in notificationsFiltered) {
        notificationsFiltered[index].creator = "dummy";
        notificationsFiltered[index].recipients = [
          notificationsFiltered[index].sender
        ];
      }
      result = notificationsFiltered.concat(result);
      return result;
    }
  }
};
</script>
<style scoped>
.recents {
  background-color: rgba(0, 0, 0, 0);
  user-select: none;
  transition: 0.3s;

  display: flex;
  flex-direction: column;
  height: 100%;
  flex-shrink: 0;
  overflow: hidden;
}
.tab {
  transition: 0.3s;
}
.tab:hover {
  background-color: rgba(0, 0, 0, 0.123);
}
.spacer {
  display: flex;
  height: 5px;
}
</style>
