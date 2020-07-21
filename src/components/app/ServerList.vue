<template>
  <div class="server-left-panel">
    <div
      class="server-banner"
      @mouseenter="bannerHover = true"
      @mouseleave="bannerHover = false"
      :class="{ extendBanner: server && server.banner }"
      v-if="currentServerID"
    >
      <img
        class="banner-image"
        @click="bannerImageClicked"
        v-if="server && server.banner"
        :src="
          `${bannerDomain + server.banner}${bannerHover ? '' : '?type=webp'}`
        "
      />
      <div class="gradient" @click="bannerImageClicked" v-if="server.banner" />
      <div class="sub-banner">
        <div class="verified" v-if="server.verified" title="Verified Server">
          <span class="material-icons">check</span>
        </div>
        <div class="text" :title="servers[currentServerID].name">{{ servers[currentServerID].name }}</div>
        <div class="options-button material-icons" @click="openServerContext">more_vert</div>
      </div>
    </div>
    <div class="channels-list">
      <channels-list v-if="currentServerID" :server-i-d="currentServerID" />
      <div v-else class="not-selected">
        <div class="material-icons">dns</div>
        <div>Select a server</div>
      </div>
    </div>
  </div>
</template>

<script>
import ChannelsList from "@/components/app/ServerTemplate/ChannelsList.vue";
import config from "@/config";

export default {
  components: {
    ChannelsList
  },
  data() {
    return {
      bannerDomain: config.nertiviaCDN,
      openedServer: null,
      bannerHover: false
    };
  },
  methods: {
    openAddServer() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "addServer",
        visibility: true
      });
    },
    clickServer(serverID) {
      this.openedServer = serverID;
      this.$store.dispatch("servers/setcurrentServerID", serverID);
    },
    openExploreTab() {
      this.$store.dispatch("setCurrentTab", 0);
    },
    openServerContext(event) {
      const rect = event.target.getBoundingClientRect();
      if (this.checkServerContextOpened) {
        this.$store.dispatch("setAllPopout", {
          show: false,
          type: null
        });
        return;
      }
      this.$store.dispatch("setAllPopout", {
        show: true,
        type: "SERVER",
        serverID: this.servers[this.currentServerID].server_id,
        creatorUniqueID: this.servers[this.currentServerID].creator.uniqueID,
        x: rect.left - 30,
        y: rect.top + 35
      });
    },
    bannerImageClicked() {
      this.$store.dispatch(
        "setImagePreviewURL",
        this.bannerDomain + this.server.banner
      );
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
    currentServerID() {
      return this.$store.getters["servers/currentServerID"];
    },
    server() {
      return this.servers[this.currentServerID];
    },
    checkServerContextOpened() {
      const contextDetail = this.$store.getters.popouts.allPopout;
      return contextDetail.show && contextDetail.type === "SERVER";
    }
  }
};
</script>

<style scoped lang="scss">

.verified {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  background-color: #267dff;
  border-radius: 50%;
  right: 0px;
  bottom: 0px;
  user-select: none;
  margin-right: 5px;
  flex-shrink: 0;
  .material-icons {
    color: #ffffff;
    font-size: 12px;
  }
}
.server-left-panel {
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;
  flex: 1;
  overflow: hidden;
}

.channels-list {
  display: flex;
  flex: 1;
  height: 100%;
  overflow: auto;
}
.server-banner {
  display: flex;
  overflow: hidden;
  position: relative;
  flex-direction: row;
  background-color: rgba(255, 255, 255, 0.2);
  height: 35px;
  border-radius: 4px;
  margin: 10px;
  box-shadow: 0px 2px 12px rgba(255, 255, 255, 0.1);
  flex-shrink: 0;
}
.extendBanner {
  box-shadow: 0px 0px 5px rgb(0, 0, 0);
  height: 130px;
  background-color: rgb(32, 32, 32);
  overflow: hidden;
  position: relative;
  .gradient {
    cursor: pointer;
    height: 70px;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    position: absolute;
  }
  .sub-banner {
    align-items: flex-end;
    padding-bottom: 10px;
    background: transparent;
  }
  .options-button {
    margin-bottom: -7px;
  }
}
.banner-image {
  position: absolute;
  object-fit: cover;
  height: 100%;
  z-index: 2;
  width: 100%;
  cursor: pointer;
}
.sub-banner {
  display: flex;
  color: white;
  align-self: flex-end;
  height: 35px;
  width: 100%;
  align-items: center;
  padding-left: 10px;
  position: relative;
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
.not-selected {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  align-items: center;
  align-content: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  .material-icons {
    font-size: 35px;
    margin-bottom: 15px;
  }
}
.options-button {
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
