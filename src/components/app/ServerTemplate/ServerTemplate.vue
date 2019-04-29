<template>
  <div :class="{server: true, 'add-server': mode === 'ADD_SERVER'}">
    <div class="small-view" @click="showChannels = !showChannels">
      <profile-picture size="50px" v-if="!mode" :url="tempImage"/>
      <div class="add-icon" v-if="mode === 'ADD_SERVER'">
        <i class="material-icons">add</i>
      </div>
      <div class="server-name">{{mode === 'ADD_SERVER'? 'Add Server' : ServerData.name}}</div>
    </div>
    <div ref="container">
      <div class="channel-list" v-if="openChannel">
        <ChannelTemplate
          v-for="channel in ServerData.channels"
          :key="channel.name"
          :channel-data="channel"
        />
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import ChannelTemplate from "@/components/app/ServerTemplate/ChannelTemplate.vue";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import smoothReflow from "vue-smooth-reflow";

export default {
  mixins: [smoothReflow],
  props: ["ServerData", "openChannel", "mode"],
  components: { ProfilePicture, ChannelTemplate },
  data() {
    return {
      showChannels: false,
      tempImage: config.domain + "/avatars/noob"
    };
  },
  mounted() {
    this.$smoothReflow({
      el: this.$refs.container
    });
  }
};
</script>

<style scoped>
.server {
  color: white;
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.137);
  border-radius: 5px;
  margin: 5px;
  transition: 0.3s;
}


.server:hover {
  background: rgba(0, 0, 0, 0.288);
}
.material-icons {
  transition: 0.3s;
}
.add-server:hover .material-icons{
  color: rgba(20, 255, 39, 0.726);
}

.small-view {
  padding-right: 0;
  display: flex;
  transition: 0.3s;
  position: relative;
  overflow: hidden;
  align-items: center;
  padding: 5px;
}

.channel-list {
  background: rgba(0, 0, 0, 0.288);
  display: flex;
  flex-direction: column;
}

.server-name {
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5px;
}
.add-icon{
  height: 56px;
  display: flex;
  align-items: center;
  margin-right: 5px;
  margin-left: 5px;
}

.add-icon .material-icons {
  font-size: 40px;
}
</style>
