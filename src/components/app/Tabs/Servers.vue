<template>
  <div class="direct-message-tab">
    <transition name="slidein">
      <server-list
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

import ServerList from "@/components/app/ServerList.vue";
import MessagePanel from "@/components/app/MessagePanel.vue";

export default {
  components: {
    ServerList,
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
.slidein-enter-active,
.slidein-leave-active {
  transition: 0.5s;
}
.slidein-enter, .slidein-leave-to /* .fade-leave-active below version 2.1.8 */ {
  margin-left: -300px;
}
@media (max-width: 600px) {
  .left-panel {
    position: absolute;
    background-color: rgba(39, 39, 39, 0.97);
  }
}
</style>
