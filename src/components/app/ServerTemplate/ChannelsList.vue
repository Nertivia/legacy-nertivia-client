<template>
  <div class="channels-list">
    <spinner
      v-if="channels === undefined"
      size="40"
    />
    <div
      v-if="channels"
      class="wrapper"
    >
      <ChannelTemplate
        v-for="channel in channels"
        :key="channel.channelID"
        :channel-data="channel"
        @click.native="openChannel(channel)"
      />
    </div>
  </div>
</template>
<script>
import Spinner from "@/components/Spinner.vue";
import ChannelTemplate from "@/components/app/ServerTemplate/ChannelTemplate.vue";
import ServerService from "@/services/ServerService.js";
import {bus} from '@/main.js'

export default {
  components: { ChannelTemplate, Spinner },
  props: ["serverID"],
  computed: {
    channels() {
      const channelsIds = this.$store.getters["servers/channelsIDs"][this.serverID];
      if (channelsIds) {
        let channels = [];
        for ( let channelID of channelsIds ){
          channels.push(this.$store.getters.channels[channelID])
        }
        return channels;
      } else {
        return false;
      }
    }
  },

  async beforeMount() {
    if (this.channels !== undefined) return;
    const { ok, error, result } = await ServerService.getChannels(
      this.serverID
    );
    if (!ok) {
      console.log(error);
    } else {
      const channelsIDs = [];
      for (let index = 0; index < result.data.length; index++) {
        const element = result.data[index];
        element.server = undefined;
        element.server_id = this.serverID
        this.$store.dispatch('channel', element)
        channelsIDs.push(element.channelID)
      }
      this.$store.dispatch("servers/AddChannelsIDs", {
        serverID: this.serverID,
        channelsIDs: channelsIDs
      });
    }
  },
  methods: {
    openChannel(channel) {
      // add to local storage
      const selectedChannels = JSON.parse(localStorage.getItem('selectedChannels') || '{}')
      selectedChannels[this.serverID] = channel.channelID;
      localStorage.setItem('selectedChannels', JSON.stringify(selectedChannels));

      const notificationExists = this.$store.getters.notifications.find(n => n.channelID === channel.channelID)

      if (notificationExists && document.hasFocus()) {
        this.$socket.emit('notification:dismiss', {channelID: channel.channelID});
      }
      
      bus.$emit('closeLeftMenu');
      this.$store.dispatch('openChannel', channel)
    }
  }
};
</script>

<style scoped>
.channels-list {
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  overflow: hidden;
  overflow-y: auto;
  flex-direction: column;
}

/* ------- SCROLL BAR -------*/
/* width */
.channels-list::-webkit-scrollbar {
  width: 3px;
}
</style>


