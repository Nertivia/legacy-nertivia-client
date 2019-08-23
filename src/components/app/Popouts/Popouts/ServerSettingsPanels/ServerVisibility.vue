<template>
    <div class="content-inner" v-if="server">
      <div class="details">Making your server visibility public means that your server will be shown publicly in the Nertivia's "Explore" tab.</div>
      <div class="content">
        <div class="toggle">
          <div class="title">Server Visibility</div>
          <div class="item" @click="privateServer = false"><div class="box" :class="{selected: !privateServer}"></div> Public</div>
          <div class="item" @click="privateServer = true"><div class="box" :class="{selected: privateServer}"></div> Private</div>
        </div>
      </div>
    </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";


export default {
  components: {},
  data() {
    return {
      privateServer: true
    }
  },
  methods: {

  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID
      return this.$store.getters['servers/servers'][serverID]
    }
  }
};
</script>

<style lang="scss" scoped>

.content-inner {
  display: flex;
  flex-direction: column;
  user-select: none;
}

.details {
  margin: 10px;
  opacity: 0.9;
}

.content {
  display: flex;
}

.toggle {
  background: rgb(46, 46, 46);
  border-radius: 5px;
  padding: 5px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  .item {
    display: flex;
    margin: 3px;
    cursor: pointer;
    .box {
      width: 20px;
      height: 20px;
      border-radius: 5px;
      background: rgb(95, 95, 95);
      margin-right: 5px;
      &.selected {
        background: rgb(34, 156, 255);
      }
    }
  }
}


.button {
  padding: 10px;
  background: rgba(255, 0, 0, 0.719);
  margin: auto;
  border-radius: 10px;
  transition: 0.3s;
  user-select: none;
}
.button:hover {
  background: rgb(255, 0, 0);
}
</style>


