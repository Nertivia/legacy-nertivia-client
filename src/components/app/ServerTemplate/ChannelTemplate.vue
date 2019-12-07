<template>
  <div
    class="channel"
    :class="{selected: selectedChannelID === channelData.channelID}"
  >
    <i class="material-icons">storage</i>
    <div class="channel-name">{{ channelData.name }}</div>
    <div class="notification" v-if="hasNotifications">
      {{hasNotifications.count}}
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
  padding: 5px;
  transition: background 0.3s;
  font-size: 14px;
  cursor: pointer;
  color: white;
  user-select: none;
  overflow: hidden;
  padding-right: 10px;
  padding-left: 10px;
  margin: 5px;
  border-radius: 4px;
}
.channel:hover {
  background: #053c4c;
}
.channel.selected {
  background: #053240;
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
  height: 34px;
  right: 0;
  top: 0;
  bottom: 0;
  min-width: 40px;
  max-width: 70px;
  border-radius: 1px;
}
</style>
