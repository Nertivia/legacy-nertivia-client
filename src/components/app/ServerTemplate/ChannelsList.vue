<template>
  <div class="channels-list">
    <spinner v-if="channels === undefined" size="40"/>
    <div class="wrapper" v-if="channels">
      <ChannelTemplate v-for="channel in channels" :key="channel.name" :channel-data="channel" @click.native="openChannel(channel)"/>
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
  methods: {
    openChannel(channel) {
      const notificationExists = this.$store.getters.notifications.find(n => n.channelID === channel.channelID)

      if (notificationExists && document.hasFocus()) {
        this.$socket.emit('notification:dismiss', {channelID: channel.channelID});
      }
      
      bus.$emit('closeLeftMenu');
      this.$store.dispatch('openChannel', channel)
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
      this.$store.dispatch("servers/setChannelsIDs", {
        serverID: this.serverID,
        channelsIDs: channelsIDs
      });
    }
  },
  computed: {
    channels() {
      const channelsIds = this.$store.getters["servers/channelsIDs"][this.serverID];
      if (channelsIds) {
        let channels = [];
        for ( let channelID of channelsIds ){
          channels.push(this.$store.getters.channels[channelID])
        }
        return channels;
      }
    }
  }
};
</script>

<style scoped>
.channel-list {
  background: rgba(0, 0, 0, 0.288);
  display: flex;
  flex-direction: column;
}
</style>


