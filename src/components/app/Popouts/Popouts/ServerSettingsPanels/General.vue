<template>
  <div class="content-inner">
    <div class="top">
      <profile-picture
        class="server-avatar"
        size="100px"
        :url="update.avatar || `${avatarDomain}/${server.avatar}`"
      />
      <div class="button" @click="$refs.avatarBrowser.click()">Edit Avatar</div>
        <input
          ref="avatarBrowser"
          type="file"
          accept=".jpeg, .jpg, .png, .gif"
          class="hidden"
          @change="avatarChangeEvent"
        >
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
      <div class="button save-button" :class="{disabled: requestSent}" v-if="changed" @click="updateServer()">{{requestSent ? 'Saving...' : 'Save Changes'}}</div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import ServerService from "@/services/ServerService";
import DropDown from "./DropDownMenu";
import { mapState } from "vuex";
import path from "path";

export default {
  components: { DropDown, ProfilePicture },
  data() {
    return {
      requestSent: false,
      changed: false,
      avatarDomain: config.domain + "/avatars/",
      update: {}
    };
  },
  methods: {
    inputEvent(name, event) {
      this.$set(this.update, name, event.target.value);
    },
    changeEvent(name, value) {
      this.$set(this.update, name, value);
    },
    async updateServer() {
      if (this.requestSent) return;
      this.requestSent = true;
      const {ok, error, result} = await ServerService.updateServer(this.server.server_id, this.update);
      if (!ok) {
        this.requestSent = false;
        if (!error.response) {
          return this.$store.dispatch('setGenericMessage', "Something went wrong. Try again later.") 
        }
        return this.$store.dispatch('setGenericMessage', error.response.data.message) 
      }
      this.update = {};
      this.requestSent = false;
      
    },
    avatarChangeEvent(e) {
      if (!this.googleDriveLinked) {
        return this.$store.dispatch("setPopoutVisibility", {
          name: "GDLinkMenu",
          visibility: true
        });
      }
      const file = event.target.files[0];
      const _this = this;
      const maxSize = 2092000; 
      if (file.size > maxSize) {
        return this.$store.dispatch('setGenericMessage', "Image is larger than 2MB") 
      }
      event.target.value = "";
      const allowedFormats = [".png", ".jpeg", ".gif", ".jpg"];
      if (!allowedFormats.includes(path.extname(file.name).toLowerCase())) {
        return this.$store.dispatch('setGenericMessage', "That file format is not allowed!"); 
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);
      
      reader.onload = function () {
        _this.$set(_this.update, 'avatar', reader.result);
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
        return this.$store.dispatch('setGenericMessage', "Something went wrong. Try again later.") 
      };
    }
  },
  watch: {
    update(obj) {
      if ( Object.keys(obj).length === 0 ){
        return this.changed = false
      }
      this.changed = true;
    }
  },
  computed: {
    googleDriveLinked() {
      return this.$store.getters['settingsModule/settings'].GDriveLinked
    },
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
  align-self: center;
  margin: 10px;
}
.top {
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  flex-shrink: 0;
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
  flex-shrink: 0;
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
  padding: 10px;
  align-self: center;
  margin: 10px;
  flex-shrink: 0;
}
.input input {
  margin-top: 2px;
  margin-bottom: 0;
  border-radius: 5px;
  width: 190px;
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
.save-button.disabled {
  background: rgba(59, 59, 59, 0.692);
}

.hidden {
  display: none;
}
</style>



