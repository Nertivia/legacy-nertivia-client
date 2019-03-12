<template>
  <div :class="{friend: true, notifyAnimation: (notifications && notifications > 0) }" :style="`background: ${status.bgColor};`" @click="openChat">
    <div class="profile-picture" :style="`border-color: ${status.statusColor}; background-image: url(${userAvatar})`">
      <div class="status" :style="`background-image: url(${status.statusURL})`" ></div>
    </div>
    <div class="information">
      <div class="username">{{$props.username}}</div>
      <div class="status-name" :style="`color: ${status.statusColor}`">{{status.statusName}}</div>
    </div>
    <div class="notification" v-if="notifications && notifications >0">
      <div class="notification-inner">
        {{notifications}}
      </div>
    </div>
  </div>
</template>

<script>
import channelService from '@/services/channelService';
import messagesService from '@/services/messagesService';
import config from '@/config.js'
import statuses from '@/utils/statuses';
import {bus} from '@/main'

export default {
  props: ['username', 'tag',  'channelID',  'uniqueID', ],
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
      bus.$emit('closeLeftMenu');
      // dismiss notification if exists
      if (this.notifications && this.notifications >= 1 && document.hasFocus()) {
        this.$socket.emit('notification:dismiss', {channelID: this.channelID});
      }
      this.$store.dispatch('selectedChannelID', this.$props.channelID);
      this.$store.dispatch('setChannelName', this.$props.username);
      if (this.$store.getters.messages[this.$props.channelID]) return;
      if (this.$store.getters.channels[this.$props.channelID] && !this.$store.getters.messages[this.$props.channelID]) return this.getMessages();
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
    notifications () {
      const channelID = this.$props.channelID;
      const notifications = this.$store.getters.notifications.find(function(e) {
        return e.channelID == channelID
      })
      if (!notifications || (this.$props.channelID === this.$store.getters.selectedChannelID && document.hasFocus())) return;
      return notifications.count;
    },
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
        statusColor: statuses[parseInt(status)].color,
        bgColor: statuses[parseInt(status)].bgColor
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
  padding: 5px;
  padding-right: 0;
  display: flex;
  transition: 0.3s;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.notifyAnimation:before{
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: notifyAnime;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards

}
@keyframes notifyAnime {
  0%{
    background: rgba(255, 0, 0, 0.198);
  }
  40%{
    background: rgba(255, 0, 0, 0.411);
  }
  60%{
    background: rgba(255, 0, 0, 0.411);
  }
  100%{
    background: rgba(255, 0, 0, 0.198);
  }
}

.friend:hover {
    background-color: rgba(0, 0, 0, 0.246);
}

.profile-picture{
  height: 30px;
  width: 30px;
  background-color: rgba(0, 0, 0, 0.425);
  border-radius: 50%;
  margin: auto;
  margin-left: 2px;
  margin-right: 5px;
  border: solid 2px;
  position: relative;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  transition: 0.3s;
}
.information{
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
  flex: 1;
}

.notification{
  position: absolute;
  display: flex;
  background: rgba(134, 134, 134, 0.315);
  height: 100%;
  right: 0;
  top: 0;
  bottom: 0;
  width: 50px;
  border-radius: 1px;
}
.notification-inner{ 
  margin: auto;
}

.status {
  position: absolute;
  height: 15px;
  width: 15px;
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
  bottom: -4px;
}

.status-name{
  opacity: 0;
  font-size: 13px;
  transition: 0.3s;
  height: 0;
}
.friend:hover .status-name { 
  opacity: 0.8;
  height: 13px;
}
</style>

