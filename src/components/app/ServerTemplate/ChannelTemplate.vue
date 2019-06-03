<template>
  <div :class="{channel: true,  notifyAnimation: hasNotifications}">
    <i class="material-icons">storage</i>
    <div class="channel-name">{{ChannelData.name}}</div>
  </div>
</template>

<script>
export default {
  props: ["ChannelData"],
  computed: {
    hasNotifications() {
      const notifications = this.$store.getters.notifications;
      const find = notifications.find(n => n.channelID === this.ChannelData.channelID)
      return find
    }
  }
};
</script>


<style scoped>

.notifyAnimation{

  animation: notifyAnime;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;

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



.channel {
  display: flex;
  align-items: center;
  margin: 5px;
	margin-top: 3px;
	margin-bottom: 3px;
  padding: 5px;
  border-radius: 5px;
  transition: 0.3s;
	font-size: 14px;
}
.channel:hover {
  background: rgba(139, 139, 139, 0.288);
}
.channel-name {
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5px;
}
</style>
