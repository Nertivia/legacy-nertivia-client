<template>
  <div class="direct-message-tab"
    :class="{ darken: showLeftPanel || showMembersPanel }"
    :data-server="currentServer ? currentServer.name: undefined"
  >
    <transition :name="$mq === 'mobile' ? 'slide-left' : null">
      <div class="left-panel"
        v-show="($mq === 'mobile' && showLeftPanel) || $mq !== 'mobile'"
        v-click-outside="hideLeftPanel"
      >
        <div class="inner">
          <navigation />
          <div class="wrapper">
            <MyMiniInformation />
            <transition name="fade" mode="out-in">
              <server-list :key="currentServerID" v-if="currentTab === 2" />
              <friends-list v-if="currentTab === 1" />
            </transition>
          </div>
        </div>
        <MainNav v-if="$mq === 'mobile'" />
      </div>
    </transition>
    <message-panel :type="currentTab === 1 ? 0 : currentTab === 2 ? 1 : null" />
    <transition :name="$mq !== 'desktop' ? 'slide-right' : 'none'">
      <members-list
        v-if="
          currentServerID &&
            currentTab === 2 &&
            ((($mq === 'members_panel' || $mq === 'mobile') &&
              showMembersPanel) ||
              $mq === 'desktop')
        "
        v-click-outside="hideMembersPanel"
        class="members-panel"
      />
    </transition>
  </div>
</template>

<script>
import { bus } from "@/main";
import MessagePanel from "@/components/app/MessagePanel.vue";
import Navigation from "@/components/app/Navigation.vue";
import MyMiniInformation from "@/components/app/MyMiniInformation.vue";

const FriendsList = () => import("@/components/app/FriendsList.vue");
const MembersList = () => import("@/components/app/MembersList.vue");
const ServerList = () => import("@/components/app/ServerList.vue");
const MainNav = () => import("@/components/app/MainNav.vue");

export default {
  components: {
    ServerList,
    FriendsList,
    MessagePanel,
    MembersList,
    Navigation,
    MyMiniInformation,
    MainNav
  },
  data() {
    return {
      showLeftPanel: false,
      showMembersPanel: false
    };
  },
  mounted() {
    bus.$on("toggleLeftMenu", () => {
      this.showLeftPanel = !this.showLeftPanel;
    });
    bus.$on("toggleMembersPanel", () => {
      this.showMembersPanel = !this.showMembersPanel;
    });
    bus.$on("closeLeftMenu", () => {
      this.showLeftPanel = false;
    });
  },
  methods: {
    hideLeftPanel(event) {
      if (this.showLeftPanel) {
        const closestMenuBtn = event.target.closest(".show-menu-button");
        const closestNavBtn = event.target.closest(".main.navigation");
        if (closestMenuBtn === null && closestNavBtn === null) {
          this.showLeftPanel = false;
        }
      }
    },
    hideMembersPanel(event) {
      if (this.showMembersPanel) {
        if (event.target.closest(".show-members-button") == null) {
          this.showMembersPanel = false;
        }
      }
    }
  },
  computed: {
    currentTab() {
      return this.$store.getters.currentTab;
    },
    currentServerID() {
      return this.$store.getters["servers/currentServerID"];
    },
    currentServer() {
      if (this.currentTab !== 2) return undefined;
      return this.$store.getters["servers/servers"][this.currentServerID];
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global";

.left-panel {
  z-index: 2;
  height: 100%;
  width: 340px;
  max-width: calc(100% - 60px);
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;

}
.inner {
  z-index: 2;
  height: 100%;
  width: 340px;
  max-width: 100%;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  z-index: 1;
}
.wrapper {
  display: flex;
  flex-direction: column;
  background: #272e37;
  width: 100%;
  overflow: hidden;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.5);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: 0.5s;
}
.slide-left-enter, .slide-left-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(-340px);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: 0.5s;
}
.slide-right-enter, .slide-right-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateX(300px);
}

@media (max-width: 600px) {
  .left-panel {
    position: absolute;
    bottom: 0;
    top: 0;
    z-index: 3;
    backdrop-filter: blur(10px);
    background: $bg-color;
    box-shadow: 0px 0px 10px 0px black;
  }
  .inner {
    height: calc(100% - 60px);
  }
  .wrapper {
    border-bottom-left-radius: 10px;
    border-top-left-radius: initial;
    border-top-right-radius: initial;
    
  }
  .darken::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.4);
  }
}
</style>
