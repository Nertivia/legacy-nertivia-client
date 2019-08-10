<template>
  <div class="content">
    <errors-list-template :errors="errors" v-if="errors" />
    <div class="content-inner">

      <div class="channels-list">
        <div
          class="channel add-channel-button"
          :class="{warn: Object.keys(channels).length === 50}"
          @click="createChannel()"
        >
          <div class="material-icons">add</div>
          <div>Create Channel</div>
        </div>
        <div
          class="channel"
          v-for="(channel, index) in channels"
          :key="channel.channelID"
          :class="{selected: index === selectedChannelIndex}"
          @click="channelClick($event, index)"
        >
          <div class="name">{{channel.name}}</div>
        </div>
      </div>
      <div class="details" v-if="channels[selectedChannelIndex]">
        <div class="input">
          <div class="input-title">Channel Name</div>
          <input
            type="text"
            ref="name"
            placeholder="Channel Name"
            :default-value.prop="channels[selectedChannelIndex].name"
            @input="inputEvent('name', $event)"
          />
        </div>
        <div class="button" v-if="update.name" @click="updateChannel">Save Changes</div>
        <div
          class="button warn delete-server disabled"
          v-if="server.default_channel_id === channels[selectedChannelIndex].channelID"
        >Cannot delete default channel</div>
        <div
          class="button warn delete-server"
          :class="{disabled: deleteClicked}"
          v-if="server.default_channel_id !== channels[selectedChannelIndex].channelID"
          @click="deleteChannel"
        >{{deleteButtonConfirmed ? 'ARE YOU SURE?' : 'Delete Channel' }}</div>
      </div>
      
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import ServerService from "@/services/ServerService";
import { mapState } from "vuex";
import ErrorsListTemplate from "@/components/app/errorsListTemplate";
export default {
  components: { ErrorsListTemplate },
  data() {
    return {
      deleteButtonConfirmed: false,
      deleteClicked: false,
      selectedChannelIndex: 0,
      errors: null,
      update: {
        name: null
      }
    };
  },
  methods: {
    async createChannel() {
      const { ok, error, result } = await ServerService.createChannel(
        this.server.server_id,
        "New Channel"
      );
    },
    async updateChannel() {
      this.errors = null;
      const data = {
        name: this.update.name || this.channels[this.selectedChannelIndex].name
      };
      const { ok, error, result } = await ServerService.updateChannel(
        this.server.server_id,
        this.channels[this.selectedChannelIndex].channelID,
        data
      );
      if (ok) {
        this.update.name = null;
      } else {
        if (error.response) {
          if (error.response.data.message)
            this.errors = [{ msg: error.response.data.message }];
          else this.errors = error.response.data.errors;
        } else {
          this.errors = [{ msg: "Something went wrong." }];
        }
      }
    },
    async deleteChannel() {
      if (this.deleteClicked) return;
      if (!this.deleteButtonConfirmed) {
        return (this.deleteButtonConfirmed = true);
      }
      this.deleteClicked = true;
      const { ok, error, result } = await ServerService.deleteChannel(
        this.server.server_id,
        this.channels[this.selectedChannelIndex].channelID
      );
      this.deleteButtonConfirmed = false;
      this.selectedChannelIndex = null;
      this.deleteClicked = false;
    },
    inputEvent(name, event) {
      this.update.name = event.target.value;
    },
    channelClick(event, index) {
      this.selectedChannelIndex = index;
      this.$refs["name"].value = this.channels[this.selectedChannelIndex].name;
      this.update.name = null;
      this.deleteButtonConfirmed = false;
    }
  },
  computed: {
    server() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      return this.$store.getters["servers/servers"][serverID];
    },
    channels() {
      const serverID = this.$store.state.popoutsModule.serverSettings.serverID;
      const channels = this.$store.getters.channels;
      const channelIDs = this.$store.getters["servers/channelsIDs"][serverID];
      return channelIDs.map(c => {
        return channels[c];
      });
    }
  }
};
</script>

<style scoped>
.server-avatar {
  background: grey;
  height: 90px;
  width: 90px;
  border-radius: 50%;
}
.content-inner {
  display: flex;
  height: 100%;
  position: relative;
}
.channels-list {
  background: #161616e5;
  height: 100%;
  width: 165px;
  flex-shrink: 0;
  overflow: auto;
}
.channel {
  border-radius: 5px;
  padding: 5px;
  margin: 5px;
  user-select: none;
  cursor: pointer;
  transition: 0.3s;
  display: flex;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.channel .name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.channel div {
  align-self: center;
}
.channel:hover {
  background: rgba(58, 58, 58, 0.849);
}
.channel.selected {
  background: rgb(58, 58, 58);
}
.add-channel-button {
  background: rgba(17, 148, 255, 0.692);
  transition: 0.3s;
}
.add-channel-button:hover {
  background: rgb(17, 148, 255);
}
.details {
  display: flex;
  flex-direction: column;
  width: 100%;
  overflow: hidden;
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
.button.warn {
  background: rgba(255, 17, 17, 0.692);
}
.button.warn:hover {
  background: rgb(255, 17, 17);
}
.button.disabled {
  background: grey;
}
.button.disabled:hover {
  background: grey;
}
.add-channel-button.warn {
  background: rgba(255, 17, 17, 0.192);
  cursor: not-allowed;
}

.delete-server {
  margin: auto;
  margin-bottom: 0;
  margin-left: 0;
  margin-right: 0;
  align-self: initial;
  border-radius: 0;
  text-align: center;
}
.input {
  display: flex;
  flex-direction: column;
  background: rgba(22, 22, 22, 0.87);
  border-radius: 10px;
  padding: 5px;
  margin: 5px;
}
.input input {
  border-radius: 5px;
  width: initial;
}
</style>



