<template>
  <div class="server-left-panel">
    <!-- <navigation /> -->
    <MyMiniInformation />
    <div
      class="server-banner"
      @mouseenter="bannerHover = true"
      @mouseleave="bannerHover = false"
      :class="{ extendBanner: server && server.banner }"
      v-if="selectedServerID"
    >
      <img
        class="banner-image"
        @click="bannerImageClicked"
        v-if="server && server.banner"
        :src="
          `${bannerDomain}${server.banner}${bannerHover ? '' : '?type=webp'}`
        "
      />
      <div class="sub-banner">
        <div class="text" :title="servers[selectedServerID].name">
          {{ servers[selectedServerID].name }}
        </div>
        <div class="options-button material-icons" @click="openServerContext">
          more_vert
        </div>
      </div>
    </div>
    <div class="channels-list">
      <channels-list v-if="selectedServerID" :server-i-d="selectedServerID" />
    </div>
  </div>
</template>

<script>
import MyMiniInformation from "@/components/app/MyMiniInformation.vue";
import ChannelsList from "@/components/app/ServerTemplate/ChannelsList.vue";
import config from "@/config";

export default {
  components: {
    MyMiniInformation,
    ChannelsList
  },
  data() {
    return {
      openedServer: null,
      bannerDomain: config.domain + "/media/",
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
      this.$store.dispatch("servers/setSelectedServerID", serverID);
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
        serverID: this.servers[this.selectedServerID].server_id,
        creatorUniqueID: this.servers[this.selectedServerID].creator.uniqueID,
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
    selectedServerID() {
      return this.$store.getters["servers/selectedServerID"];
    },
    server() {
      return this.servers[this.selectedServerID];
    },
    checkServerContextOpened() {
      const contextDetail = this.$store.getters.popouts.allPopout;
      return contextDetail.show && contextDetail.type === "SERVER";
    }
  }
};
</script>

<style scoped lang="scss">
.server-left-panel {
  height: 100%;
  width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;
  flex: 1;
  background: rgba(0, 0, 0, 0.14);
  overflow: hidden;
  border-top-left-radius: 10px;
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
  background-color: rgba(32, 32, 32, 0.4);
  height: 35px;
  border-radius: 4px;
  margin: 10px;
  box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.13);
  flex-shrink: 0;
}
.extendBanner {
  height: 130px;
  background-color: rgb(32, 32, 32);
  overflow: hidden;
  .sub-banner {
    align-items: flex-end;
    padding-bottom: 10px;
    background: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.8));
    height: 70px;
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
  background-color: rgba(0, 0, 0, 0.5);
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

@media (max-width: 600px) {
  .server-left-panel {
    border-radius: 0;
  }
}
</style>
