<template>
  <div class="content">
    <div class="center">
      <div class="information">
        {{ $t("notification-settings-notice") }}
      </div>
      <div class="box">
        <div class="title">{{ $t("server-settings") }}</div>
        <div
          class="radio-box"
          :class="{
            selected: !currentServerMute || currentServerMute.muted === 0
          }"
          @click="muteServer(0)"
        >
          <div class="circle" />
          <div class="name">{{ $t("enable-notifications") }}</div>
        </div>
        <div
          class="radio-box"
          :class="{
            selected: currentServerMute && currentServerMute.muted === 1
          }"
          @click="muteServer(1)"
        >
          <div class="circle" />
          <div class="name">{{ $t("mute-sound") }}</div>
        </div>
        <div
          class="radio-box"
          :class="{
            selected: currentServerMute && currentServerMute.muted === 2
          }"
          @click="muteServer(2)"
        >
          <div class="circle" />
          <div class="name">{{ $t("disable-notifications") }}</div>
        </div>
      </div>
      <div class="box">
        <div class="title">{{ $t("channel-settings-soon" ) }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import ServerService from "@/services/ServerService";
export default {
  methods: {
    async muteServer(type) {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      await ServerService.muteServer(serverID, type);
    }
  },
  computed: {
    currentServerMute() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      if (!this.$store.state.notificationsModule.mutedServers) {
        return null;
      }
      return this.$store.state.notificationsModule.mutedServers.find(
        ms => ms.server_id === serverID
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.content {
  width: 100%;
  display: flex;
  overflow: auto;
}
.center {
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
}
.information {
  opacity: 0.6;
  margin: 10px;
  margin-top: 20px;
}
.box {
  background: rgba(255, 255, 255, 0.2);
  align-self: center;
  padding: 10px;
  border-radius: 6px;
  margin-top: 20px;
}

.title {
  text-align: center;
  align-self: center;
}

.radio-box {
  display: flex;
  align-items: center;
  margin-top: 5px;
  cursor: pointer;

  .circle {
    height: 15px;
    margin-right: 10px;
    width: 15px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.4);
  }

  &:hover {
    .circle {
      background: rgba(255, 255, 255, 0.8);
    }
  }
  &.selected {
    .circle {
      background: white;
    }
  }
}
</style>
