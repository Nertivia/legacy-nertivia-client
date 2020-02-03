<template>
  <div
    class="direct-message-tab"
    :class="{ darken: showLeftPanel || showMembersPanel }"
  >
    <transition name="slide-left">
      <server-list
        v-show="($mq === 'mobile' && showLeftPanel) || $mq !== 'mobile'"
        v-click-outside="hideLeftPanel"
        class="left-panel"
      />
    </transition>
    <message-panel :type="1" />
    <transition :name="$mq !== 'desktop' ? 'slide-right' : 'none'">
      <members-list
        v-if="
          selectedServerID &&
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

import ServerList from "@/components/app/ServerList.vue";
import MessagePanel from "@/components/app/MessagePanel.vue";
import MembersList from "@/components/app/MembersList.vue";

export default {
  components: {
    ServerList,
    MessagePanel,
    MembersList
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
        if (event.target.closest(".show-menu-button") == null) {
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
