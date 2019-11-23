<template>
  <div
    class="channel"
    :class="{notifyAnimation: hasNotifications, selected: selectedChannelID === channelData.channelID}"
  >
    <i class="material-icons">storage</i>
    <div class="channel-name">{{ channelData.name }}</div>
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
.notifyAnimation {
  animation: notifyAnime;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
}
@keyframes notifyAnime {
  0% {
    background: rgba(255, 0, 0, 0.198);
  }
  40% {
    background: rgba(255, 0, 0, 0.411);
  }
  60% {
    background: rgba(255, 0, 0, 0.411);
  }
  100% {
    background: rgba(255, 0, 0, 0.198);
  }
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
</style>
