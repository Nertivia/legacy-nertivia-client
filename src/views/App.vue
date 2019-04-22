<template>
  <div id="app">
    <vue-headful :title="title" description="Nertivia Chat Client"/>
    <div class="background-image"></div>
    <transition name="fade-between-two" appear>
      <ConnectingScreen v-if="!loggedIn"/>
      <div class="box" v-if="loggedIn">
        <div class="tabs">

          <div :class="`tab ${currentTab === 0 ? 'selected' : ''}`" @click="switchTab(0)">
            <i class="material-icons">list_alt</i>
            Changelog
          </div>

          <div :class="`tab ${currentTab === 1 ? 'selected' : ''}`" @click="switchTab(1)">
            <i class="material-icons">chat</i>
            Direct Message
          </div>

          <div :class="`tab ${currentTab === 2 ? 'selected' : ''}`" @click="switchTab(2)">
            <i class="material-icons">forum</i>
            Servers
          </div>
          <div :class="`tab ${currentTab === 3 ? 'selected' : ''}`" @click="switchTab(3)">
            <i class="material-icons">rss_feed</i>
            Server Browser
          </div>
        </div>
        <div class="panel-layout">
          <news v-if="currentTab == 0" />
          <span class="direct-message-tab" v-if="currentTab == 1">
            <transition name="slidein">
              <LeftPanel
                class="left-panel"
                v-click-outside="hideLeftPanel"
                v-show="$mq === 'mobile' && showLeftPanel || $mq === 'desktop'"
              ></LeftPanel>
            </transition>
            <RightPanel/>
          </span>
          <div class="coming-soon" v-if="currentTab > 1">
            <div class="icon"><i class="material-icons">cached</i></div>
            <div class="text">Coming soon!</div>
          </div>
        </div>
      </div>
    </transition>
    <Popouts v-if="loggedIn"/>
  </div>
</template>

<script>
import { bus } from "../main";
import Popouts from "@/components/app/Popouts.vue";
import LeftPanel from "./../components/app/LeftPanel.vue";
import RightPanel from "./../components/app/RightPanel.vue";
import News from "./../components/app/News.vue";
import changelog from '@/utils/changelog.js';
import ConnectingScreen from "./../components/app/ConnectingScreen.vue";

export default {
  name: "app",
  components: {
    LeftPanel,
    RightPanel,
    ConnectingScreen,
    Popouts,
    News
  },
  data() {
    return {
      currentTab: localStorage.getItem('currentTab') || 0,
      showLeftPanel: false,
      title: "Nertivia"
    };
  },
  methods: {
    hideLeftPanel(event) {
      if (this.showLeftPanel) {
        if (event.target.closest(".show-menu-button") == null) {
          this.showLeftPanel = false;
        }
      }
    },
    switchTab(index) {
      localStorage.setItem("currentTab", index);
      this.currentTab = index;
    }
  },
  mounted() {

    // check if changelog is updated
    const seenVersion = localStorage.getItem('changelog-version-seen');
    if (!seenVersion || seenVersion < changelog[0].version) {
      this.currentTab = 0;
      localStorage.setItem('currentTab', 0)
    }
    localStorage.setItem('changelog-version-seen', changelog[0].version)

    bus.$on("toggleLeftMenu", () => {
      this.showLeftPanel = !this.showLeftPanel;
    });
    bus.$on("closeLeftMenu", () => {
      this.showLeftPanel = false;
    });

    bus.$on("title:change", title => {
      this.title = title;
    });
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn;
    }
  }
};
</script>


<style scoped>

.coming-soon{
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.39);
  color: white;
}
.coming-soon .icon{

}
.coming-soon .material-icons {
  font-size: 100px;
}

.direct-message-tab{
  display: flex;
  width: 100%;
  height: 100%;
}


.tabs {
  display: flex;
  overflow-y: hidden;
  overflow-x: auto;
  height: 35px;
  flex-shrink: 0;
}
.tabs::-webkit-scrollbar {
  height: 5px;
}

.tab {
  flex-shrink: 0;
  margin: auto;
  margin-right: 1px;
  margin-left: 1px;
  margin-bottom: 0;
  background: rgba(0, 0, 0, 0.63);
  color: white;
  padding: 5px;
  border-top-right-radius: 5px;
  border-top-left-radius: 5px;
  cursor: default;
  user-select: none;
  transition: 0.3s;
}
.tab.selected{
  background: rgba(71, 71, 71, 0.637);
}

.tab:hover{
  background: rgba(71, 71, 71, 0.637);
}

.tab .material-icons {
  font-size: 15px;
  vertical-align: -2px;
}

.slidein-enter-active,
.slidein-leave-active {
  transition: 0.5s;
}
.slidein-enter, .slidein-leave-to /* .fade-leave-active below version 2.1.8 */ {
  margin-left: -300px;
}

.fade-between-two-enter-active,
.fade-between-two-leave-active {
  transition: 0.3s;
}
.fade-between-two-enter,
.fade-between-two-leave-to {
  opacity: 0 !important;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media (max-width: 600px) {
  .left-panel {
    position: absolute;
    top: 47px;
    height: calc(100% - 47px);
    background-color: rgba(39, 39, 39, 0.97);
  }
}
@media (max-width: 470px) {
  .tabs {
    height: 40px;
  }
}
</style>



<style>
html {
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: "Roboto", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #383838;
  height: 100%;
}
textarea {
  font-family: "Roboto", sans-serif;
}
.box {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
}
.background-image {
  background: url(./../assets/background.jpg);
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
}

.panel-layout {
  display: flex;
  height: 100%;
}
</style>

<style>
/* ------- SCROLL BAR -------*/
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #8080806b;
  border-radius: 10px;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #f5f5f559;
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #f5f5f59e;
  border-radius: 10px;
}
</style>

