<template>
  <div :class="{server: true, 'add-server': mode === 'ADD_SERVER'}">
    <div :class="{'small-view': true, notifyAnimation: notification}">
      <profile-picture size="50px" v-if="!mode" :url="tempImage"/>
      <div class="add-icon" v-if="mode === 'ADD_SERVER'">
        <i class="material-icons">add</i>
      </div>
      <div class="server-name">{{mode === 'ADD_SERVER'? 'Create / Join Server' : ServerData.name }}</div>
      <div
        ref="contextMenuButton"
        class="options-context-button"
        v-if="mode !== 'ADD_SERVER'"
        @click="showContextMenu = !showContextMenu"
      >
        <i class="material-icons">more_vert</i>
      </div>
      <div class="options-context-menu" v-if="showContextMenu" v-click-outside="closeContextMenu">
        <div class="menu-button" @click="createInvite(ServerData.server_id)">Manage Invites</div>
        <div
          class="menu-button warn"
          @click="leaveServer(ServerData.server_id)"
          v-if="ServerData.creator.uniqueID !== user.uniqueID"
        >Leave Server</div>
        <div
          class="menu-button warn"
          @click="leaveServer(ServerData.server_id)"
          v-if="ServerData.creator.uniqueID === user.uniqueID"
        >Delete Server</div>
      </div>
    </div>
    <div ref="container">
      <channels-list v-if="openChannel" :serverID="ServerData.server_id"/>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import ChannelsList from "@/components/app/ServerTemplate/ChannelsList.vue";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import ServerService from "@/services/ServerService";
import smoothReflow from "vue-smooth-reflow";

export default {
  mixins: [smoothReflow],
  props: ["ServerData", "openChannel", "mode"],
  components: { ProfilePicture, ChannelsList },
  data() {
    return {
      showContextMenu: false,
      showChannels: false,
      tempImage: config.domain + "/avatars/noob"
    };
  },
  methods: {
    createInvite(serverID) {
      this.showContextMenu = false;
      this.$store.dispatch("setServerIDContextMenu", serverID);
      this.$store.dispatch("setPopoutVisibility", {
        name: "showServerInviteMenu",
        visibility: true
      });
    },
    closeContextMenu(event) {
      if (
        event.target.closest(".options-context-button") ===
        this.$refs.contextMenuButton
      )
        return;
      this.showContextMenu = false;
    },
    async leaveServer(serverID) {
      this.showContextMenu = false;
      const {ok, error, result} = await ServerService.leaveServer(serverID);
    }
  },
  mounted() {
    this.$smoothReflow({
      el: this.$refs.container
    });
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    notification() {
      const notifications = this.$store.getters.notifications;
      const channels = this.$store.getters.channels
      const notification = notifications.find(e => {
        return channels[e.channelID] && channels[e.channelID].server_id && this.ServerData && channels[e.channelID].server_id === this.ServerData.server_id 
      })
      return notification;
    }
  }
};
</script>

<style scoped>


.notifyAnimation:before{
  content: '';
  position: absolute;
  z-index: -1;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  animation: notifyAnime;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
  border-radius: 5px;

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


.server {
  color: white;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.137);
  border-radius: 5px;
  margin: 5px;
  transition: 0.3s;
}

.server:hover {
  background: rgba(0, 0, 0, 0.288);
}
.material-icons {
  transition: 0.3s;
}
.add-server:hover .material-icons {
  color: rgba(20, 255, 39, 0.726);
}

.small-view {
  padding-right: 0;
  display: flex;
  transition: 0.3s;
  position: relative;
  align-items: center;
  padding: 5px;
}

.server-name {
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5px;
  flex: 1;
  white-space: nowrap;
}
.add-icon {
  height: 56px;
  display: flex;
  align-items: center;
  margin-right: 5px;
  margin-left: 5px;
}

.add-icon .material-icons {
  font-size: 40px;
}
.options-context-button {
  display: flex;
  align-items: center;
  margin-right: 5px;
  color: rgba(255, 255, 255, 0.623);
  border-radius: 50%;
  transition: 0.3s;
}
.options-context-button .material-icons:hover {
  color: white;
}

.options-context-menu {
  position: absolute;
  background: rgba(0, 0, 0, 0.692);
  border-radius: 10px;
  z-index: 9999;
  padding: 5px;
  right: 40px;
  top: 20px;
}
.menu-button {
  padding: 5px;
  margin: 2px;
  border-radius: 5px;
  transition: 0.3s;
}
.menu-button:hover {
  background: rgb(47, 47, 47);
}

.warn {
  color: red;
}
</style>
