<template>
  <div class="heading">
    <div class="show-menu-button" @click="toggleLeftMenu">
      <i class="material-icons">menu</i>
    </div>
    <div
      v-if="type === 1"
      class="user-status"
      :style="
        `box-shadow: 0px 0px 14px 3px ${userStatusColor}; background-color: ${userStatusColor};`
      "
    />
    <div class="information">
      <div
        :class="{ name: true, clickable: !!uniqueID }"
        @click="openUserInfoPanel"
      >
        {{ name }}
      </div>
    </div>
    <div
      v-if="type === 2 && selectedServerID"
      class="show-members-button"
      @click="toggleMembersPanel"
    >
      <i class="material-icons">view_list</i>
    </div>
  </div>
</template>

<script>
import { bus } from "@/main";
import statuses from "@/utils/statuses";
export default {
  props: [
    "type", // 0: without online status; 1: with online status; 2: server.
    "name",
    "uniqueID",
  ],

  methods: {
    openUserInfoPanel() {
      if (this.uniqueID)
        this.$store.dispatch("setUserInformationPopout", this.uniqueID);
    },
    toggleLeftMenu() {
      bus.$emit("toggleLeftMenu");
    },
    toggleMembersPanel() {
      bus.$emit("toggleMembersPanel");
    },
  },
  computed: {
    selectedServerID() {
      return this.$store.getters["servers/selectedServerID"];
    },
    userStatusColor() {
      const selectedChannel = this.$store.getters.selectedChannelID;
      const channel = this.$store.getters.channels[selectedChannel];
      const presences = this.$store.getters["members/presences"];

      let status = presences[channel.recipients[0].uniqueID] || 0;
      return statuses[status].color;
    },
  },
};
</script>

<style scoped>
.heading {
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  margin-bottom: 0;
  height: 50px;
  display: flex;
  flex-shrink: 0;
  padding-left: 10px;
  align-items: center;
  position: absolute;
  left: 0;
  right: 0;
  z-index: 2;
}
@supports (
  (-webkit-backdrop-filter: blur(4px)) or (backdrop-filter: blur(4px))
) {
  .heading {
    background: rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(4px);
  }
}
.show-menu-button {
  display: inline-block;
  margin-right: 5px;
  margin-top: 3px;
  user-select: none;
  display: none;
  cursor: pointer;
}
.show-members-button {
  display: inline-block;
  margin-right: 5px;
  margin-top: 3px;
  user-select: none;
  display: none;
  color: white;
  cursor: pointer;
}
.show-menu-button .material-icons {
  color: rgb(207, 207, 207);
  transition: 0.3s;
}
.show-menu-button .material-icons:hover {
  color: rgb(255, 255, 255);
}
.information {
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.name {
  color: white;
  font-size: 20px;
  width: 10px;
  white-space: nowrap;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}
.user-status {
  border-radius: 4px;
  height: 10px;
  width: 10px;
  margin-right: 10px;
  margin-left: 5px;
  flex-shrink: 0;
  transition: background-color 0.2s, box-shadow 0.2s;
}
.clickable {
  color: rgba(255, 255, 255, 0.9);
  transition: 0.2s;
  cursor: pointer;
}
.clickable:hover {
  color: white;
}

@media (max-width: 949px) {
  .show-members-button {
    display: block;
  }
}

@media (max-width: 600px) {
  .show-menu-button {
    display: block;
  }
}
</style>
