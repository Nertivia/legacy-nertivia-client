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
import { bus } from "../../../main";
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
  methods: {
    changeCurrentChannelIndex(direction) {
      let currentChannelIndex = this.recentsArr.findIndex(
        r => r.recipients[0].id === this.currentUniqueID
      );
      if (!(currentChannelIndex + 1)) currentChannelIndex = -1;
      if (direction === "up") {
        currentChannelIndex -= 1;
      } else {
        currentChannelIndex += 1;
      }
      const channel = this.recentsArr[currentChannelIndex];
      if (!channel) return;
      this.$store.dispatch("openChat", {
        id: channel.recipients[0].id,
        channelID: channel.channelID,
        channelName: channel.recipients[0].username
      });
    }
  },
  mounted() {
    bus.$on("channels:changeCurrentIndex", this.changeCurrentChannelIndex);
    setTimeout(() => (this.loaded = true));
  },
  destroyed() {
    bus.$off("channels:changeCurrentIndex", this.changeCurrentChannelIndex);
  },
  computed: {
    currentUniqueID() {
      return this.$store.getters.selectedUserUniqueID;
    },
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
        if (recipient.id === this.user.id) continue;

        const notified = notifications.find(
          n =>
            n.sender &&
            n.sender.id === recipient.id &&
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
          id: element.sender.id
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
