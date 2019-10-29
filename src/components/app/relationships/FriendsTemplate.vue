<template>
  <div
    class="friend"
    :style="{background: status.status !== 0 ? status.bgColor : ''}"
    :class="{selected: uniqueIDSelected, notifyAnimation: (notifications && notifications > 0) }"
    @click="openChat"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      class="profile-picture"
      :style="`border-color: ${status.statusColor}; background-image: url(${userAvatar}${hover ? '' : '?type=png'})`"
      @click="openUserInformation"
    >
      <div
        class="status"
        :style="`background-image: url(${status.statusURL})`"
      />
    </div>
    <div class="information">
      <div class="username">
        {{ recipient.username }}
      </div>
      <div
        class="status-name"
        :style="`color: ${status.statusColor}`"
      >
        {{ status.statusName }}
      </div>
    </div>
    <div
      v-if="notifications && notifications >0"
      class="notification"
    >
      <div class="notification-inner">
        {{ notifications }}
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
  props: ['username', 'tag',  'channelID',  'uniqueID', 'recipient'],
  data() {
    return {
      hover: false
    }
  },
  computed: {
    notifications () {
      const channelID = this.$props.channelID;
      const channels = this.$store.getters.channels;
      const notifications = this.$store.getters.notifications.find(function(e) {
        if (channels[e.channelID] && channels[e.channelID].server_id) return;
        return e.channelID == channelID
      })
      if (!notifications || (this.$props.channelID === this.$store.getters.selectedChannelID && document.hasFocus())) return;
      return notifications.count;
    },
    userAvatar() {
      return config.domain + "/avatars/" + this.recipient.avatar
    },
    status() {
      const presences = this.$store.getters['members/presences'];
      let status = 0;
      if (presences[this.recipient.uniqueID]) {
        status = presences[this.recipient.uniqueID] || 0
      }

      return {
        status: parseInt(status),
        statusName: statuses[parseInt(status)].name,
        statusURL: statuses[parseInt(status)].url,
        statusColor: statuses[parseInt(status)].color,
        bgColor: statuses[parseInt(status)].bgColor
      }
    },
    uniqueIDSelected() {
      return this.$store.getters.selectedUserUniqueID === this.recipient.uniqueID
    }
  },
  methods: {

    async openChat(event) {
      if (event.target.closest(".profile-picture")) return;
      bus.$emit('closeLeftMenu');
      // dismiss notification if exists 
      // TODO move this into openchat or something :/
      if (this.notifications && this.notifications >= 1 && document.hasFocus()) {
        this.$socket.emit('notification:dismiss', {channelID: this.channelID});
      }
      this.$store.dispatch('openChat', {
        uniqueID: this.recipient.uniqueID,
        channelID: this.channelID,
        channelName: this.recipient.username
      })
    },
    openUserInformation() {
      this.$store.dispatch('setUserInformationPopout', this.recipient.uniqueID)
    }
  }
}
</script>


<style scoped>
.username{
  width: 150px;
  white-space: nowrap; 
  overflow: hidden;
  text-overflow: ellipsis;
}
.friend {
  color: white;
  padding: 5px;
  padding-left: 10px;
  padding-left: 10px;
  display: flex;
  transition: 0.3s;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.notifyAnimation{

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
  background: rgba(0, 0, 0, 0.3) !important;
}
.friend.selected {
  background: rgba(0, 0, 0, 0.4) !important;
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
  flex-shrink: 0;
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

