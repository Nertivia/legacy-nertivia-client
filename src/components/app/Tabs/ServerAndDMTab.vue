<template>
  <div
    class="direct-message-tab"
    :class="{ darken: showLeftPanel || showMembersPanel }"
  >
    <transition :name="$mq === 'mobile' ? 'slide-left' : null">
      <div
        class="left-panel"
        v-show="($mq === 'mobile' && showLeftPanel) || $mq !== 'mobile'"
        v-click-outside="hideLeftPanel"
      >
        <MainNav v-if="$mq === 'mobile'" />
        <div class="inner">
          <navigation />
          <div class="wrapper">
            <MyMiniInformation />
            <transition name="fade" mode="out-in">
              <server-list :key="selectedServerID" v-if="currentTab === 2" />
              <friends-list v-if="currentTab === 1" />
            </transition>
          </div>
        </div>
      </div>
    </transition>
    <message-panel :type="currentTab === 1 ? 0 : currentTab === 2 ? 1 : null" />
    <transition :name="$mq !== 'desktop' ? 'slide-right' : 'none'">
      <members-list
        v-if="
          selectedServerID &&
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
    selectedServerID() {
      return this.$store.getters["servers/selectedServerID"];
    }
  }
};
</script>

<style scoped>
.direct-message-tab {
  overflow: hidden;
}
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
  width: 100%;
  border-top-left-radius: 10px;
  overflow: hidden;
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

@media (max-width: 949px) {
  .members-panel {
    position: absolute;
    right: 0;
    bottom: 0;
    z-index: 2;
    background: linear-gradient(to bottom, #00477e 0, #016dc0);
  }
}

@media (max-width: 600px) {
  .left-panel {
    position: absolute;
    bottom: 0;
    z-index: 2;
    background: linear-gradient(to bottom, #00477e 0, #016dc0);
  }
  .wrapper {
    border-radius: 0;
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
