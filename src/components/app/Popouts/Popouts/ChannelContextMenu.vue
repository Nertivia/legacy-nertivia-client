<template>
  <div class="drop-down-menu" v-click-outside="outsideClick">
    <div
      class="item"
      @click="markAsReadButton"
      :class="{ disabled: !notificationsExist }"
    >
      <div class="material-icons">markunread_mailbox</div>
      <div class="name">{{ $t("mark-as-read") }}</div>
    </div>

    <div class="item" v-if="isMuted" @click="unmuteServer">
      <div class="material-icons">notifications</div>
      <div class="name">{{ $t("unmute-channel") }}</div>
    </div>

    <div class="item warn" v-else @click="muteServer">
      <div class="material-icons">notifications_off</div>
      <div class="name">{{ $t("mute-channel") }}</div>
    </div>

    <div class="item" @click="copyChannelID">
      <div class="material-icons">developer_board</div>
      <div class="name">{{ $t("copy-id") }}</div>
    </div>
  </div>
</template>

<script>
import serverService from "@/services/ServerService";
export default {
  data() {
    return {};
  },
  methods: {
    closeMenu() {
      this.$store.dispatch("setAllPopout", {
        show: false,
        type: null
      });
    },
    outsideClick(event) {
      if (event.target.classList.contains("options-button")) return;
      this.closeMenu();
    },
    setPosition() {
      let y = this.contextDetails.y;
      let x = this.contextDetails.x;

      // if context is out of screen
      if (x + this.$el.clientWidth > window.innerWidth) {
        x = window.innerWidth - this.$el.clientWidth;
      }
      if (y + this.$el.clientHeight > window.innerHeight) {
        y = window.innerHeight - this.$el.clientHeight;
      }

      this.$el.style.top = y + "px";
      this.$el.style.left = x + "px";
    },
    markAsReadButton() {
      if (!this.notificationsExist) return;
      this.closeMenu();
      this.$socket.client.emit("notification:dismiss", {
        channelID: this.contextDetails.channelID
      });
    },
    async muteServer() {
      this.closeMenu();
      await serverService.muteChannel(
        this.contextDetails.serverID,
        this.contextDetails.channelID
      );
    },
    async unmuteServer() {
      this.closeMenu();
      await serverService.unmuteChannel(
        this.contextDetails.serverID,
        this.contextDetails.channelID
      );
    },
    copyChannelID() {
      this.closeMenu();
      this.$clipboard(this.contextDetails.channelID);
    }
  },
  mounted() {
    this.setPosition();
  },
  watch: {
    contextDetails() {
      this.setPosition();
    }
  },
  computed: {
    contextDetails() {
      return this.$store.getters.popouts.allPopout;
    },
    isMuted() {
      const mutedChannels = this.$store.getters.mutedChannels;
      return mutedChannels.includes(this.contextDetails.channelID);
    },
    user() {
      return this.$store.getters.user;
    },
    serverMember() {
      return this.$store.getters["servers/serverMembers"].find(
        sm =>
          sm.server_id === this.contextDetails.serverID &&
          sm.uniqueID === this.user.uniqueID
      );
    },
    notificationsExist() {
      const notifications = this.$store.getters.notifications;
      return notifications.find(
        n => n.channelID === this.contextDetails.channelID
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "./ContextMenu.scss";
</style>
