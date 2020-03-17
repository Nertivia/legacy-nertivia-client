<template>
  <div
    class="channel"
    :class="{ selected: selectedChannelID === channelData.channelID }"
  >
    <div class="dot" v-if="!isMuted" />
    <div class="mute-icon material-icons" v-else>notifications_off</div>
    <div class="channel-name">{{ channelData.name }}</div>
    <div
      class="notification"
      v-if="hasNotifications"
      :title="hasNotifications.count"
    >
      {{ hasNotifications.count > 99 ? "99+" : hasNotifications.count }}
    </div>
  </div>
</template>

<script>
export default {
  props: ["channelData"],
  computed: {
    selectedChannelID() {
      return this.$store.getters.selectedChannelID;
    },
    hasNotifications() {
      const notifications = this.$store.getters.notifications;

      if (
        document.hasFocus() &&
        this.selectedChannelID === this.channelData.channelID
      ) {
        return false;
      }
      const find = notifications.find(
        n => n.channelID === this.channelData.channelID
      );
      return find;
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
  color: rgba(255, 255, 255, 0.8);
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
  background: #00477d;
  color: white;
}
.channel.selected {
  background: #003660;
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
