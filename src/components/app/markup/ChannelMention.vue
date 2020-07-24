<template>
  <span class="channel" v-on:click="goToChannel">#{{this.channel.name}}</span>
</template>

<script>
import { bus } from "@/main";

export default {
  props: ["channel"],
  methods: {
    goToChannel: function() {
      bus.$emit("openServer", this.channel.server_id, this.channel.channelID);
    }
  }
};
</script>

<style scoped>
.channel {
  background: rgba(0, 0, 0, 0.3);
  color: rgb(94, 164, 255);
  font-weight: bold;
  border-radius: 4px;
  padding: 2px;
  cursor: pointer;
  transition: 0.2s;
  display: inline-block;
}
.channel:hover {
  background: rgba(0, 0, 0, 0.5);
}
</style>