<template>
  <div
    class="server"
    :data-servername="serverData.name"
    :class="{
      selected: selectedServerID === serverData.server_id,
      notifyAnimation: notification.notification,
      mentioned: notification.mentioned
    }"
    @contextmenu.prevent="contextEvent"
    @mouseenter="hoverEvent"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <profile-picture
      size="45px"
      class="avatar"
      :url="`${avatarDomain}/${serverData.avatar}${hover ? '' : '?type=webp'}`"
    />
  </div>
</template>

<script>
import { bus } from "../../../main.js";
import config from "@/config.js";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";

export default {
  components: { ProfilePicture },
  props: ["serverData"],
  data() {
    return {
      avatarDomain: config.domain + "/avatars",
      hover: false
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    selectedServerID() {
      return this.$store.getters["servers/selectedServerID"];
    },
    selectedChannelID() {
      return this.$store.getters.selectedChannelID;
    },
    notification() {
      const notifications = this.$store.getters.notifications;

      const channels = this.$store.getters.channels;
      const filteredNotifications = notifications.filter(e => {
        return (
          channels[e.channelID] &&
          channels[e.channelID].server_id &&
          this.serverData &&
          channels[e.channelID].server_id === this.serverData.server_id &&
          (this.selectedChannelID !== e.channelID || !document.hasFocus())
        );
      });
      const mentioned = filteredNotifications.find(n => n.mentioned);
      return {
        mentioned: !!mentioned,
        notification: !!filteredNotifications.length
      };
    }
  },
  methods: {
    hoverEvent(event) {
      const rect = event.target.getBoundingClientRect();
      //let centerX = targetNode.offsetLeft + targetNode.offsetWidth / 2;
      //let centerY = targetNode.offsetTop + targetNode.offsetHeight / 2;
      bus.$emit("server-tool-tip", {
        serverID: this.serverData.server_id,
        top: rect.top
      });
    },
    contextEvent(event) {
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "SERVER",
        serverID: this.serverData.server_id,
        creatorUniqueID: this.serverData.creator.uniqueID,
        x: event.clientX,
        y: event.clientY
      });
    }
  }
};
</script>

<style scoped lang="scss">
.server {
  position: relative;
  z-index: 1;
  display: flex;
  align-self: center;
  width: 70px;
  height: 70px;
  flex-shrink: 0;
  justify-content: center;
  align-content: center;
  align-items: center;
  user-select: none;
  transition: background 0.2s;
  cursor: pointer;
  &:hover::before {
    content: "";
    position: absolute;
    top: 15px;
    bottom: 15px;
    left: 0;
    width: 3px;
    background: #ffffff5e;
    transition: 0.2s;
  }
  &.selected::before {
    content: "";
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: 0;
    width: 3px;
    background: #ffffffc5;
  }
}
.notifyAnimation:after {
  content: "!";
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  font-size: 15px;
  position: absolute;
  z-index: 115651;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ee3e34;
}
.mentioned:after {
  content: "@";
  margin-bottom: 10px;
  font-size: 13px;
  background: #ff6947;
}
</style>
