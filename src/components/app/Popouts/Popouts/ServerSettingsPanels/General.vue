<template>
  <div class="content-inner">
    <div class="top">
      <!-- <div class="server-avatar"></div> -->
      <div class="input">
        <div class="input-title">Server Name</div>
        <input
          type="text"
          ref="name"
          placeholder="Channel Name"
          :default-value.prop="server.name"
          @input="inputEvent('name', $event)"
        />
      </div>
    </div>
    <div class="details">
      <div class="options">
        <drop-down
          :items="channels"
          :selected-item="defaultChannel"
          name="Default Channel"
          @change="changeEvent('default_channel_id', $event.channelID)"
        />
      </div>
      <div class="button save-button" v-if="changed">Save Changes</div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import Spinner from "@/components/Spinner.vue";
import ServerService from "@/services/ServerService";
import DropDown from "./DropDownMenu";
import { mapState } from "vuex";

export default {
  components: { Spinner, DropDown },
  data() {
    return {
      changed: false,
      update: {}
    };
  },
  methods: {
    inputEvent(name, event) {
      this.$set(this.update, name, event.target.value);
    },
    changeEvent(name, value) {
      this.$set(this.update, name, value);
    }
  },
  watch: {
    update(test) {
      this.changed = true;
    }
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    },
    defaultChannel() {
      const channels = this.$store.getters.channels;
      if (this.update.default_channel_id) {
        return channels[this.update.default_channel_id];
      }
      return channels[this.server.default_channel_id];
    },
    channels() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      const channelsIds = this.$store.getters["servers/channelsIDs"][serverID];
      if (channelsIds) {
        let channels = [];
        for (let channelID of channelsIds) {
          channels.push(this.$store.getters.channels[channelID]);
        }
        return channels;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>
.content-inner {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.server-avatar {
  background: grey;
  height: 90px;
  width: 90px;
  border-radius: 50%;
  flex-shrink: 0;
}
.top {
  display: flex;
  width: 100%;
  justify-content: center;
}
.details {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
.options {
  width: 230px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-self: center;
}
.server-name {
  align-self: center;
  margin-left: 10px;
}
.input {
  display: flex;
  flex-direction: column;
  background-color: rgb(44, 44, 44);
  border-radius: 10px;
  padding: 5px;
  align-self: center;
  margin: 10px;
}
.input input {
  border-radius: 10px;
}
.button {
  background: rgba(17, 148, 255, 0.692);
  padding: 10px;
  border-radius: 5px;
  align-self: center;
  margin: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
}
.button:hover {
  background: rgb(17, 148, 255);
}
.save-button {
  margin-top: 50px;
}
</style>



