<template>
  <div class="direct-message-tab" :class="{ darken: showLeftPanel }">
    <transition name="slidein">
      <friends-list
        v-show="($mq === 'mobile' && showLeftPanel) || $mq !== 'mobile'"
        v-click-outside="hideLeftPanel"
        class="left-panel"
      />
    </transition>
    <message-panel :type="0" />
  </div>
</template>

<script>
import { bus } from "@/main";

import FriendsList from "@/components/app/FriendsList.vue";
import MessagePanel from "@/components/app/MessagePanel.vue";

export default {
  components: {
    FriendsList,
    MessagePanel
  },
  data() {
    return {
      showLeftPanel: true
    };
  },
  mounted() {
    bus.$on("toggleLeftMenu", () => {
      this.showLeftPanel = !this.showLeftPanel;
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
    }
  }
};
</script>

<style scoped>
.direct-message-tab {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.left-panel {
  z-index: 2;
}
.slidein-enter-active,
.slidein-leave-active {
  transition: 0.5s;
}
.slidein-enter, .slidein-leave-to /* .fade-leave-active below version 2.1.8 */ {
  /* margin-left: -300px; */
  transform: translateX(-340px);
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
