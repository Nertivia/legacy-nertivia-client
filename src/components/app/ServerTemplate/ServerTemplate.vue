<template>
  <div
    class="server"
    :data-servername="serverData.name"
    :class="{
      selected: currentServerID === serverData.server_id && currentTab === 2,
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
      :hover="hover"
      :avatar="serverData.avatar"
      :uniqueID="serverData.server_id"
    />
  </div>
</template>

<script>
import { bus } from "../../../main.js";
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";

export default {
  components: { ProfilePicture },
  props: ["serverData"],
  data() {
    return {
      hover: false
    };
  },
  computed: {
    currentTab() {
      return this.$store.getters.currentTab;
    },
    user() {
      return this.$store.getters.user;
    },
    currentServerID() {
      return this.$store.getters["servers/currentServerID"];
    },
    currentChannelID() {
      return this.$store.getters.currentChannelID;
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
          (this.currentChannelID !== e.channelID || !document.hasFocus())
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
  height: 55px;
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
  bottom: 0px;
  right: 10px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ff6947;
}
.mentioned:after {
  content: "@";
  margin-bottom: 0px;
  font-size: 13px;
  background: #ee3e34;
}
</style>
