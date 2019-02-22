<template>
  <div id="app">
    <vue-headful :title="title" description="Nertivia Chat Client"/>
    <div class="background-image"></div>
    <transition name="fade-between-two" appear >
      <ConnectingScreen v-if="!loggedIn" />
      <div class="box" v-if="loggedIn">
        <div class="panel-layout">
          <transition name="slidein">
            <LeftPanel class="left-panel" v-click-outside="hideLeftPanel" v-show="$mq === 'mobile' && showLeftPanel || $mq === 'desktop'"> </LeftPanel>
          </transition>
          <RightPanel> </RightPanel>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <settings v-if="showSettings  && loggedIn" />
    </transition>
    <GDriveLinkMenu v-if="loggedIn && showGDLinkMenu" />
  </div>
</template>

<script>
import {bus} from '../main'
import Settings from '@/components/app/Settings.vue'
import GDriveLinkMenu from '@/components/app/GDriveLinkMenu.vue'
import LeftPanel from './../components/app/LeftPanel.vue'
import RightPanel from './../components/app/RightPanel.vue'
import ConnectingScreen from './../components/app/ConnectingScreen.vue'

export default {
  name: 'app',
  components: {
    LeftPanel,
    RightPanel,
    ConnectingScreen,
    Settings,
    GDriveLinkMenu
  },
  data() {
    return {
      showLeftPanel: false,
      showSettings: false,
      showGDLinkMenu: false,
      title: "Nertivia"
    }
  },
  methods: {
    hideLeftPanel(test) {
      if (this.showLeftPanel){
        if(test.target.closest('.show-menu-button') == null){
          this.showLeftPanel = false;
        }
      }
    }
  },
  mounted() {
    bus.$on('toggleLeftMenu', () => {
      this.showLeftPanel = !this.showLeftPanel;
    })
    bus.$on('closeLeftMenu', () => {
      this.showLeftPanel = false;
    })
    bus.$on('openSettings', () => {
      this.showSettings = true;
    })
    bus.$on('closeSettings', () => {
      this.showSettings = false;
    })
    bus.$on('title:change', (title) => {
      this.title = title;
    })
    bus.$on('GDriveLink:show', () => {
      this.showGDLinkMenu = true;
    })
  },
  computed: {
    loggedIn() {
      return this.$store.getters.loggedIn
    }
  }
}
</script>


<style scoped>
.slidein-enter-active, .slidein-leave-active {
  transition: .5s;
}
.slidein-enter, .slidein-leave-to /* .fade-leave-active below version 2.1.8 */ {
  margin-left: -300px;
}

.fade-between-two-enter-active, .fade-between-two-leave-active{
  transition: 0.3s;
}
.fade-between-two-enter, .fade-between-two-leave-to {
  opacity: 0 !important;
}



.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

@media (max-width: 600px) {
  .left-panel{
    position: absolute;
    top: 47px;
    height: calc(100% - 47px);
    background-color: rgba(39, 39, 39, 0.97);
  }
}
</style>



<style>

html{
  height: 100%;
}

body{
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #383838;
  height: 100%;
}
.box {
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
}

/* Handle */
::-webkit-scrollbar-thumb {
    background: #f5f5f559;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
    background: #f5f5f59e;
}

</style>

