<template>
  <div class="friend" @click="openChat">
    <div class="profile-picture" :style="`border-color: ${status.statusColor}; background-image: url(${userAvatar})`">
      <div class="status" :style="`background-image: url(${status.statusURL})`" ></div>
    </div>
    <div class="information">
      <div class="username">{{$props.username}}</div>
      <div class="status-name" :style="`color: ${status.statusColor}`">{{status.statusName}}</div>
    </div>
  </div>
</template>

<script>
import channelService from '@/services/channelService';
import messagesService from '@/services/messagesService';
import config from '@/config.js'
import statuses from '@/statuses';

export default {
  props: ['username', 'tag',  'channelID',  'uniqueID'],
  methods: {
    async getMessages() {
      const {ok, error, result} = await messagesService.get(this.$props.channelID);
      if ( ok ) {
        this.$store.dispatch('messages', {channelID: result.data.channelID, messages: result.data.messages});
      } else {
        // TODO handle this
        console.log (error.response)
      }
    },
    async openChat() {
      this.$store.dispatch('selectedChannelID', this.$props.channelID);
      this.$store.dispatch('setName', this.$props.username);
      if (this.$store.getters.channels[this.$props.channelID]) return
      const {ok, error, result} = await channelService.post(this.$props.channelID);
      if ( ok ) {
        this.$store.dispatch('channel', result.data.channel);
        this.getMessages();
      } else {
        // TODO handle this
        console.log(error)
      }
    }
  },
  computed: {
    user() {
      return this.$store.getters.user.friends[this.$props.uniqueID].recipient;
    },
    userAvatar() {
      return config.domain + "/avatars/" + this.user.avatar
    },
    status() {
      const status = this.$store.getters.user.friends[this.$props.uniqueID].recipient.status || 0
      return {
        statusName: statuses[parseInt(status)].name,
        statusURL: statuses[parseInt(status)].url,
        statusColor: statuses[parseInt(status)].color
      }
    }
  }
}
</script>


<style scoped>
.friend {
  color: white;
  background-color: rgba(0, 0, 0, 0.137);
  margin: 5px;
  padding: 10px;
  display: flex;
  transition: 0.3s;
  border-radius: 3px;
}

.friend:hover {
    background-color: rgba(0, 0, 0, 0.246);
}

.profile-picture{
  height: 40px;
  width: 40px;
  background-color: rgba(0, 0, 0, 0.425);
  border-radius: 50%;
  margin: auto;
  margin-left: 2px;
  margin-right: 5px;
  border: solid 3px;
  position: relative;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
}
.information{
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
  flex: 1;
}

.status {
  position: absolute;
  height: 20px;
  width: 20px;
  background-color: black;
  border-radius: 50%;
  background-size: calc(100% + 2px);
  background-position: center;
  bottom: -10px;
  right: -5px;
  opacity: 0;
  transition: 0.3s;
}

.friend:hover .status { 
  opacity: 1;
  bottom: -5px;
}

.status-name{
  opacity: 0;
  font-size: 13px;
  transition: 0.3s;
  height: 0;
}
.friend:hover .status-name { 
  opacity: 0.8;
  height: 19px;
}
</style>

