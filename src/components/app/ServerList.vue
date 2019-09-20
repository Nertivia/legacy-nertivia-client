<template>
  <div class="left-panel">
    <MyMiniInformation />
    <div class="actions">
      <div class="action" @click="openAddServer">
        <div class="material-icons">add</div>
        <div class="text">Add Server</div>
      </div>
      <div class="action" @click="openExploreTab">
        <div class="material-icons">explore</div>
        <div class="text">Explore</div>
      </div>
    </div>
    <div class="list">
      <server
        v-for="(data, index) in servers"
        :key="index.server_id"
        :server-data="data"
        :open-channel="selectedServerID && selectedServerID === data.server_id"
        @click.native="toggleChannel(data.server_id, $event)"
      />
    </div>
  </div>
</template>

<script>
import MyMiniInformation from "@/components/app/MyMiniInformation.vue";
import Server from "@/components/app/ServerTemplate/ServerTemplate.vue";
import {bus} from '@/main'

export default {
  components: {
    MyMiniInformation,
    Server
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
    toggleChannel(serverID, event) {
      if (!event.target.closest('.small-view') || event.target.closest('.options-context-button') || event.target.closest('.options-context-menu')) return;
      if (this.openedServer === serverID) {
        this.openedServer = null;
        this.$store.dispatch('servers/setSelectedServerID', null)
      }
      else{
        this.openedServer = serverID;
        this.$store.dispatch('servers/setSelectedServerID', serverID)
      }
    },
    openExploreTab() {
      bus.$emit('changeTab', 0)
    }
  },
  computed: {
    servers() {
      const data = this.$store.getters['servers/servers'];
      return Object.keys(data).map(key => {
        return data[key];
      }).slice().reverse()
    },
    selectedServerID() {
      return this.$store.getters['servers/selectedServerID'];
    },
  }
};
</script>

<style scoped lang="scss" >
.left-panel {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.671);
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;
}
.list {
  margin: 2px;
  margin-left: 5px;
  margin-right: 5px;
  flex: 1;
  overflow: auto;
  user-select: none;
}

/* ------- SCROLL BAR -------*/
/* width */
.list::-webkit-scrollbar {
  width: 3px;
}

/* Track */
.list::-webkit-scrollbar-track {
  background: #8080806b;
}

/* Handle */
.list::-webkit-scrollbar-thumb {
  background: #f5f5f559;
}

/* Handle on hover */
.list::-webkit-scrollbar-thumb:hover {
  background: #f5f5f59e;
}

.actions {
  color: white;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  user-select: none;
  .action {
    display: flex;
    padding: 5px;
    margin: 2px;
    align-items: center;
    align-content: center;
    cursor: pointer;
    color: rgb(223, 223, 223);
    border-radius: 5px;
    transition: 0.2s;
    .material-icons {
      color: white;
      margin-right: 5px;
    }
    &:hover {
      background: rgba(0, 0, 0, 0.24);
    }
  }
}
</style>
