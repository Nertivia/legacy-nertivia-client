<template>
  <div class="recents">
    <virtual-list :size="50" :remain="20" v-if="loaded">
      <FriendsTemplate
        v-for="(channel, key) of recentsArr"
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
      return this.$store.getters.channels;
    },
    sortedChannels() {
      const channels = Object.values(this.channels).reverse();
      const sorted = channels
        .concat()
        .sort((a, b) => b.lastMessaged - a.lastMessaged);
      return sorted;
    },
    recentsArr() {
      const notifications = this.$store.getters.notifications;

      const unOpenedDms = [];
      const highPriority = [];
      const lowPriority = [];

      for (let index = 0; index < this.sortedChannels.length; index++) {
        const channel = this.sortedChannels[index];
        if (channel.server_id) continue;
        const recipient = channel.recipients[0];
        if (recipient.uniqueID === this.user.uniqueID) continue;

        const notified = notifications.find(
          n =>
            n.sender.uniqueID === recipient.uniqueID &&
            n.channelID === channel.channelID
        );

        if (notified) {
          highPriority.push(channel);
        } else {
          lowPriority.push(channel);
        }
      }

      for (let index = 0; index < notifications.length; index++) {
        const element = notifications[index];
        if (this.channels[element.channelID]) continue;
        const recipient = {
          username: element.sender.username,
          tag: element.sender.tag,
          avatar: element.sender.avatar,
          uniqueID: element.sender.uniqueID
        };
        unOpenedDms.push({
          recipients: [recipient],
          channelID: element.channelID,
          lastMessaged: null
        });
      }

      return [...unOpenedDms, ...highPriority, ...lowPriority];
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
