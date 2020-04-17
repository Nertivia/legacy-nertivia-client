<template>
  <div class="content server-manage">
    <errors-list-template :errors="errors" v-if="errors" />
    <div class="content-inner">
      <div class="channels-list">
        <div
          class="channel add-channel-button"
          :class="{ warn: Object.keys(channels).length === 50 }"
          @click="createChannel()"
        >
          <div class="material-icons">add</div>
          <div>Create Channel</div>
        </div>
        <div
          class="channel"
          v-for="(channel, index) in channels"
          :key="channel.channelID"
          :class="{ selected: index === currentChannelIndex }"
          @click="channelClick($event, index)"
        >
          <div class="name">{{ channel.name }}</div>
        </div>
      </div>
      <div class="details" v-if="channels[currentChannelIndex]">
        <div class="input">
          <div class="input-title">Channel Name</div>
          <input
            type="text"
            ref="name"
            placeholder="Channel Name"
            :default-value.prop="channels[currentChannelIndex].name"
            @input="inputEvent('name', $event)"
          />
        </div>
        <div class="input">
          <div class="input-title">Permissions</div>
          <div class="check-box" @click="updatePermissions('send_message')">
            <div class="box" :class="{ checked: sendMessagePermission }" />
            <div class="name">Send Messages</div>
          </div>
        </div>

        <div
          class="button"
          v-if="update.name || update.permissions"
          @click="updateChannel"
        >
          Save Changes
        </div>
        <div
          class="button warn delete-server disabled"
          v-if="
            server.default_channel_id ===
              channels[currentChannelIndex].channelID
          "
        >
          Cannot delete default channel
        </div>
        <div
          class="button warn delete-server"
          :class="{ disabled: deleteClicked }"
          v-if="
            server.default_channel_id !==
              channels[currentChannelIndex].channelID
          "
          @click="deleteChannel"
        >
          {{ deleteButtonConfirmed ? "ARE YOU SURE?" : "Delete Channel" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ServerService from "@/services/ServerService";
import ErrorsListTemplate from "@/components/app/errorsListTemplate";
export default {
  components: { ErrorsListTemplate },
  data() {
    return {
      deleteButtonConfirmed: false,
      deleteClicked: false,
      currentChannelIndex: 0,
      errors: null,
      update: {
        name: null
      }
    };
  },
  methods: {
    async createChannel() {
      await ServerService.createChannel(this.server.server_id, "New Channel");
    },
    async updateChannel() {
      this.errors = null;
      const data = {
        name: this.update.name || this.channels[this.currentChannelIndex].name
      };
      if (this.update.permissions) {
        data.permissions = this.update.permissions;
      }
      const { ok, error } = await ServerService.updateChannel(
        this.server.server_id,
        this.channels[this.currentChannelIndex].channelID,
        data
      );
      if (ok) {
        this.update = { name: null };
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
      await ServerService.deleteChannel(
        this.server.server_id,
        this.channels[this.currentChannelIndex].channelID
      );
      this.deleteButtonConfirmed = false;
      this.currentChannelIndex = null;
      this.deleteClicked = false;
    },
    inputEvent(name, event) {
      this.update.name = event.target.value;
    },
    channelClick(event, index) {
      this.currentChannelIndex = index;
      this.$refs["name"].value = this.channels[this.currentChannelIndex].name;
      this.update = { name: null };
      this.deleteButtonConfirmed = false;
    },
    updatePermissions(permissionName) {
      const permissions = this.update.permissions || {};
      permissions[permissionName] = !this.sendMessagePermission;
      this.$set(this.update, "permissions", permissions);
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
    },
    sendMessagePermission() {
      const channel = this.channels[this.currentChannelIndex];
      const permissions = this.update.permissions || undefined;
      if (permissions) {
        return !!permissions.send_message;
      }
      if (!channel.permissions) {
        return true;
      }
      return !!channel.permissions.send_message;
    }
  }
};
</script>

<style scoped lang="scss">
.content-inner {
  display: flex;
  height: 100%;
  position: relative;
}
.channels-list {
  background: rgba(0, 0, 0, 0.12);
  height: 100%;
  width: 165px;
  flex-shrink: 0;
  overflow: auto;
}
.channel {
  padding: 5px;
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
  background: rgba(0, 0, 0, 0.2);
}
.channel.selected {
  background: rgba(0, 0, 0, 0.4);
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
  background: rgba(0, 0, 0, 0.2);
  padding: 10px;
  align-self: center;
  margin: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
  border-radius: 4px;
}
.button:hover {
  background: rgba(0, 0, 0, 0.4);
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
  background-color: rgba(0, 0, 0, 0.4);
  padding: 10px;
  margin: 10px;
  border-radius: 4px;
}
.input input {
  width: initial;
  margin-top: 2px;
  margin-bottom: 0;
  border-radius: 4px;
}

.input-title {
  font-size: 14px;
  margin-left: 2px;
}
.check-box {
  display: flex;
  margin: 5px;
  align-content: center;
  align-items: center;
  user-select: none;
  cursor: pointer;
  .box {
    height: 20px;
    width: 20px;
    flex-shrink: 0;
    background-color: rgb(255, 31, 31);
    margin-right: 5px;
    border-radius: 2px;
    &.checked {
      background-color: rgb(31, 154, 255);
    }
  }
}
</style>
