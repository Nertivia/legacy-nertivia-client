<template>
  <div class="left-panel">
    <MyMiniInformation/>

    <div class="list">
      <server v-for="(data, index) in serverData" :key="index" :server-data="data" @click.native="toggleChannel(index, $event)" :open-channel="openedServer && openedServer === index"/>
      <server mode="ADD_SERVER"/>
    </div>
  </div>
</template>

<script>
import MyMiniInformation from "@/components/app/MyMiniInformation.vue";
import Server from "@/components/app/ServerTemplate/ServerTemplate.vue";

export default {
  components: {
    MyMiniInformation,
    Server
  },
  data() {
    return {
      openedServer: null,
      serverData: {
        "67574563576897": {
          name: "DevHelp",
          channels: [
            { name: "General", channelID: 3563567574767467 },
            { name: "NodeJS", channelID: 758546746747378 },
            { name: "Java", channelID: 57355675747875 },
            { name: "C#", channelID: 45656764765676 }
          ]
        },
        "24325587980787": {
          name: "Musica",
          channels: [
            { name: "General", channelID: 3563567574767467 },
            { name: "NodeJS", channelID: 758546746747378 },
            { name: "Java", channelID: 57355675747875 },
            { name: "C#", channelID: 45656764765676 }
          ]
        },
        "3468636435": {
          name: "IDK",
          channels: [
            { name: "General", channelID: 3563567574767467 },
            { name: "NodeJS", channelID: 758546746747378 },
            { name: "Java", channelID: 57355675747875 },
            { name: "C#", channelID: 45656764765676 }
          ]
        },
        "63575764574645": {
          name: "OWO",
          channels: [
            { name: "General", channelID: 3563567574767467 },
            { name: "NodeJS", channelID: 758546746747378 },
            { name: "Java", channelID: 57355675747875 },
            { name: "C#", channelID: 45656764765676 }
          ]
        }
      }
    };
  },
  methods: {
    toggleChannel(index, event) {
      if (!event.target.closest('.small-view')) return;
      if (this.openedServer === index) 
        this.openedServer = null;
      else
        this.openedServer = index;
    }
  }
};
</script>
<style scoped>
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
</style>
