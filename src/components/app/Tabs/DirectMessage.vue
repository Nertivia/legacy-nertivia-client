<template>
  <div class="direct-message-tab">
    <transition name="slidein">
      <friends-list
        class="left-panel"
        v-click-outside="hideLeftPanel"
        v-show="$mq === 'mobile' && showLeftPanel || $mq === 'desktop'"
      />
    </transition>
    <message-panel/>
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
      showLeftPanel: false
    };
  },
  methods: {
    hideLeftPanel(event) {
      if (this.showLeftPanel) {
        if (event.target.closest(".show-menu-button") == null) {
          this.showLeftPanel = false;
        }
      }
    }
  },
  mounted() {
    bus.$on("toggleLeftMenu", () => {
      this.showLeftPanel = !this.showLeftPanel;
    });
    bus.$on("closeLeftMenu", () => {
      this.showLeftPanel = false;
    });
  }
};
</script>

<style scoped>
.direct-message-tab {
  overflow: hidden;
  height: 100%;
  width: 100%;
}
.slidein-enter-active,
.slidein-leave-active {
  transition: 0.5s;
}
.slidein-enter, .slidein-leave-to /* .fade-leave-active below version 2.1.8 */ {
  /* margin-left: -300px; */
  transform: translateX(-300px)
}
@media (max-width: 600px) {
  .left-panel {
    position: absolute;
    background-color: rgba(39, 39, 39, 0.97);
    bottom: 0;
    height: calc(100% - 40px);
  }
}
</style>
