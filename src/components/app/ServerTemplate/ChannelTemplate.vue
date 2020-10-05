<template>
  <div
    class="channel"
    :class="{ selected: currentChannelID === channelData.channelID }"
  >
    <div class="dot" v-if="!isMuted" />
    <div class="mute-icon material-icons" v-else>notifications_off</div>
    <div class="channel-name">{{ channelData.name }}</div>
    <div class="notification" v-if="hasNotifications">
      !
    </div>
  </div>
</template>

<script>
import windowProperties from "../../../utils/windowProperties";
export default {
  props: ["channelData"],
  computed: {
    currentChannelID() {
      return this.$store.getters.currentChannelID;
    },
    focused() {
      return windowProperties.isfocused;
    },
    hasNotifications() {
      const isCurrentChannel =
        this.currentChannelID === this.channelData.channelID;
      if (this.focused && isCurrentChannel) return false;

      return this.$store.getters
        .serverNotifications(this.channelData.server_id)
        .find(c => c.channelID === this.channelData.channelID);
    },
    isMuted() {
      const mutedChannels = this.$store.getters.mutedChannels;
      return mutedChannels.includes(this.channelData.channelID);
    }
  }
};
</script>

<style scoped>
.notify {
  background: rgba(255, 0, 0, 0.411) !important;
}

.channel {
  position: relative;
  display: flex;
  align-items: center;
  padding: 10px;
  height: 18px;
  transition: background 0.2s;
  font-size: 14px;
  cursor: pointer;
  color: rgba(255, 255, 255, 0.7);
  user-select: none;
  overflow: hidden;
  padding-right: 10px;
  padding-left: 10px;
  margin: 2px;
  margin-left: 10px;
  margin-right: 10px;
  border-radius: 4px;
}
.dot {
  height: 6px;
  width: 6px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  margin-right: 5px;
}
.mute-icon {
  font-size: 18px;
  margin-left: -5px;
}
.channel:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}
.channel.selected {
  background: linear-gradient(
    137deg,
    rgba(45, 136, 255, 1) 0%,
    rgba(87, 160, 255, 1) 100%
  );
  color: white;
}

.channel-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5px;
}
.notification {
  position: absolute;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  text-align: center;
  justify-content: center;
  background: #ee3e34;
  height: 23px;
  width: 23px;
  border-radius: 50%;
  right: 10px;
  top: 8px;
  bottom: 0;
  font-size: 12px;
  font-weight: bold;
}
</style>