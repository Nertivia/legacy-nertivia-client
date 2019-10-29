<template>
  <div class="left-panel">
    <navigation />
    <div class="right">
      <div class="server-banner" v-if="selectedServerID">
        <div class="banner-image"></div>
        <div class="sub-banner" >
          <div class="text" :title="servers[selectedServerID].name">{{servers[selectedServerID].name}}</div>
          <div class="options-button material-icons" @click="openServerContext">more_vert</div>
        </div>
      </div>
      <div class="channels-list">
        <channels-list v-if="selectedServerID" :server-i-d="selectedServerID" />
      </div>
      <MyMiniInformation />
    </div>
  </div>
</template>

<script>
import MyMiniInformation from "@/components/app/MyMiniInformation.vue";
import Server from "@/components/app/ServerTemplate/ServerTemplate.vue";
import ChannelsList from "@/components/app/ServerTemplate/ChannelsList.vue";
import Navigation from "@/components/app/Navigation.vue";
import { bus } from "@/main";

export default {
  components: {
    MyMiniInformation,
    ChannelsList,
    Server,
    Navigation
  },
  data() {
    return {
      openedServer: null
    };
  },
  methods: {
    openAddServer() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "addServer",
        visibility: true
      });
    },
    clickServer(serverID, event) {
      this.openedServer = serverID;
      this.$store.dispatch("servers/setSelectedServerID", serverID);
    },
    openExploreTab() {
      this.$store.dispatch('setCurrentTab',  0)
    },
    openServerContext(event) {
      const rect = event.target.getBoundingClientRect();
      if (this.checkServerContextOpened) {
        this.$store.dispatch('setAllPopout', {
          show: false,
          type: null
        })
        return;
      }
      this.$store.dispatch('setAllPopout', {
        show: true,
        type: 'SERVER',
        serverID: this.servers[this.selectedServerID].server_id,
        creatorUniqueID: this.servers[this.selectedServerID].creator.uniqueID,
        x: rect.left - 30,
        y: rect.top + 35,
      })
    }
  },
  computed: {
    servers() {
      return this.$store.getters["servers/servers"];
    },
    serversArr() {
      const data = this.servers;
      return Object.keys(data)
        .map(key => {
          return data[key];
        })
        .slice()
        .reverse();
    },
    selectedServerID() {
      return this.$store.getters["servers/selectedServerID"];
    },
    checkServerContextOpened() {
      const contextDetail = this.$store.getters.popouts.allPopout;
      return contextDetail.show && contextDetail.type === "SERVER";
    }
  }
};
</script>

<style scoped lang="scss" >
.left-panel {
  background-color: rgba(0, 0, 0, 0.6);
  height: 100%;
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  z-index: 1;
}

.channels-list {
  display: flex;
  flex: 1;
  height: 100%;
}


.left {
  display: flex;
  align-content: center;
  align-items: center;
  flex-direction: column;
  flex-shrink: 0;
  background: rgba(29, 29, 29, 0.37);
  width: 70px;
  overflow-x: auto;
}
.right {
  display: flex;
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.server-banner {
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: row;
  background-color: rgb(32, 32, 32);
  height: 150px;
}
.banner-image {
  position: absolute;
  background-image: url("../../assets/background.jpg");
  background-position: center;
  background-size: cover;
  height: 100%;
  z-index: 2;
  width: 100%;
}
.sub-banner {
  display: flex;
  color: white;
  background-color: rgba(0, 0, 0, 0.507);
  align-self: flex-end;
  height: 35px;
  width: 100%;
  align-items: center;
  padding-left: 10px;
  position: relative;
  backdrop-filter: blur(15px);
  z-index: 2;
  user-select: none;
  overflow: hidden;
  cursor: default;
  .text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
  }
}
.options-button  {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  flex-shrink: 0;
  height: 35px;
  width: 35px;
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  font-size: 20px;
  &:hover {
    background: rgba(0, 0, 0, 0.322);
  }

}
</style>
