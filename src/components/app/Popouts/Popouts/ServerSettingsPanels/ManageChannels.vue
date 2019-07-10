<template>
    <div class="content-inner">
      <div class="channels-list">
        <div class="channel" v-for="(channel, index) in channels" :key="channel.channelID" :class="{selected: index === selectedChannelIndex}" @click="selectedChannelIndex = index">{{channel.name}}</div>
        <div class="channel" @click="createChannel()">Create Channel</div>
      </div>
      <div class="details">
        <div class="input">
        <div class="input-title">Server Name</div>
          <input type="text" placeholder="Channel Name" :value="channels[selectedChannelIndex].name">
        </div>
      </div>
    </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import Spinner from "@/components/Spinner.vue";
import ServerService from "@/services/ServerService";
import { mapState } from "vuex";

export default {
  components: {Spinner},
  data() {
    return {
      selectedChannelIndex: 0
    }
  },
  methods: {
    async createChannel() {
      const {ok, error, result} = await ServerService.createChannel(this.server.server_id, "New Channel");
      console.log(ok, error, result) 
    }
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID
      return this.$store.getters['servers/servers'][serverID]
    },
    channels() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID
      const channels = this.$store.getters.channels;
      const channelIDs = this.$store.getters['servers/channelsIDs'][serverID];
      return channelIDs.map(c => {
        return channels[c];
      })
    }
  }
};
</script>

<style scoped>
.server-avatar {
  background: grey;
  height: 90px;
  width: 90px;
  border-radius: 50%;
}
.content-inner {
  display: flex;
  height: 100%;
}
.channels-list {
  background: #161616e5;
  height: 100%;
  width: 150px;
  flex-shrink: 0;
}
.channel {
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  user-select: none;
  cursor: default;
  transition: 0.3s;
}
.channel:hover {
  background: rgba(58, 58, 58, 0.849);
}
.channel.selected {
  background: rgb(58, 58, 58);
}
.details {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.input {
  display: flex;
  flex-direction: column;
  background: rgba(22, 22, 22, 0.87);
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
}
.input input {
  border-radius: 5px;
  width: initial;
}
</style>



