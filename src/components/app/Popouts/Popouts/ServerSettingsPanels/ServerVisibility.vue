<template>
  <div class="content-inner" v-if="server">
    <div class="details">Making your server visibility public means that your server will be shown publicly in the Nertivia's "Explore" tab.</div>
    <div class="content">
      <div class="toggle">
        <div class="title">Server Visibility</div>
        <div class="item" @click="privateServer = true">
          <div class="box" :class="{selected: privateServer}"></div>Private
        </div>
        <div class="item" @click="privateServer = false">
          <div class="box" :class="{selected: !privateServer}"></div>Public
        </div>
      </div>
      <div class="public-settings" v-if="!privateServer">
        <div class="input">
          <div class="title">Description (<span :class="{warn: description.length > 150}">{{description.length}}</span>/150)</div>
          <textarea placeholder="Description" v-model="description"></textarea>
        </div>
      </div>
      <div class="button" v-if="showSaveButton">Save</div>
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
      privateServer: true,
      description: '',
      showSaveButton: false,
    };
  },
  methods: {

  },
  watch: {
    privateServer() {
      this.showSaveButton = true;
    }
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    }
  }
};
</script>

<style lang="scss" scoped>
.content-inner {
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: auto;
  height: 100%;
}

.details {
  margin: 10px;
  opacity: 0.9;
}

.content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.toggle {
  background: rgb(46, 46, 46);
  border-radius: 5px;
  padding: 5px;
  margin-left: 10px;
  display: flex;
  flex-direction: column;
  align-self: flex-start;
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

.public-settings {
  display: flex;
}

.input{
  background: rgb(46, 46, 46);
  border-radius: 5px;
  padding: 5px;
  margin: 10px;
  align-self: flex-start;
  height: 155px;
  width: 300px;
  display: flex;
  flex-direction: column;
  .title {
    margin-bottom: 5px;
  }
  textarea {
    background: rgb(34, 34, 34);
    resize: none;
    outline: none;
    padding: 10px;
    border: none;
    border-radius: 5px;
    color: white;
    flex: 1;
  }
  .warn {
    color: rgb(255, 67, 67);
  }
}

.button {
  padding: 10px;
  background: rgba(17, 148, 255, 0.692);
  border-radius: 10px;
  -webkit-transition: 0.3s;
  transition: 0.3s;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  align-self: center;
  margin-top: auto;
  margin-bottom: 15px;
}
.button:hover {
  background: rgb(17, 148, 255);
}
</style>


