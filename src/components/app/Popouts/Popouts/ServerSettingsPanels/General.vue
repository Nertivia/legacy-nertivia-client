<template>
  <div class="content">
    <errors-list-template :errors="errors" v-if="errors" />
    <div class="content-inner" :key="key">
      <div class="top">
        <div class="avatar">
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
            @change="imageChangeEvent('avatar', $event)"
          />
        </div>
        <div class="banner">
          <div
            class="banner-image"
            :style="{backgroundImage: `url(${update.banner || `${bannerDomain}${server.banner}` })`}"
          >
            <div class="banner-text"></div>
          </div>
          <div class="button" @click="$refs.bannerBrowser.click()">Edit Banner</div>
          <input
            ref="bannerBrowser"
            type="file"
            accept=".jpeg, .jpg, .png, .gif"
            class="hidden"
            @change="imageChangeEvent('banner', $event)"
          />
        </div>
      </div>
      <div class="details">
        <div class="options">
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
          <drop-down
            :items="channels"
            :selected-item="defaultChannel"
            name="Default Channel"
            @change="changeEvent('default_channel_id', $event.channelID)"
          />
        </div>
        <div
          class="button save-button"
          :class="{disabled: requestSent}"
          v-if="changed"
          @click="updateServer()"
        >{{requestSent ? 'Saving...' : 'Save Changes'}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import { bus } from "@/main";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import ErrorsListTemplate from "@/components/app/errorsListTemplate";
import ServerService from "@/services/ServerService";
import DropDown from "./DropDownMenu";
import { mapState } from "vuex";
import path from "path";

export default {
  components: { DropDown, ProfilePicture, ErrorsListTemplate },
  data() {
    return {
      requestSent: false,
      changed: false,
      errors: null,
      avatarDomain: config.domain + "/avatars/",
      bannerDomain: config.domain + "/media/",
      update: {},
      key: 1
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
      const { ok, error, result } = await ServerService.updateServer(
        this.server.server_id,
        this.update
      );
      if (!ok) {
        if (error.response) {
          if (error.response.data.message)
            this.errors = [{ msg: error.response.data.message }];
          else this.errors = error.response.data.errors;
        } else {
          this.errors = [{ msg: "Something went wrong." }];
        }
        this.requestSent = false;
        return;
      }
      this.key = Math.random();
      this.update = {};
      this.requestSent = false;
    },
    //type: avatar || banner
    imageChangeEvent(type, e) {
      if (!this.googleDriveLinked) {
        event.target.value = "";
        return this.$store.dispatch("setPopoutVisibility", {
          name: "GDLinkMenu",
          visibility: true
        });
      }
      const file = event.target.files[0];
      const _this = this;
      const maxSize = 2092000;
      if (file.size > maxSize) {
        return this.$store.dispatch(
          "setGenericMessage",
          "Image is larger than 2MB"
        );
      }
      event.target.value = "";
      const allowedFormats = [".png", ".jpeg", ".gif", ".jpg"];
      if (!allowedFormats.includes(path.extname(file.name).toLowerCase())) {
        return this.$store.dispatch(
          "setGenericMessage",
          "That file format is not allowed!"
        );
      }
      let reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function() {
        _this.$set(_this.update, type, reader.result);
      };
      reader.onerror = function(error) {
        console.log("Error: ", error);
        return this.$store.dispatch(
          "setGenericMessage",
          "Something went wrong. Try again later."
        );
      };
    }
  },
  watch: {
    update(obj) {
      if (Object.keys(obj).length === 0) {
        return (this.changed = false);
      }
      this.changed = true;
    }
  },
  mounted() {
    console.log(this.server);
  },
  computed: {
    googleDriveLinked() {
      return this.$store.getters["settingsModule/settings"].GDriveLinked;
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

<style scoped lang="scss">
.content-inner {
  height: 100%;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
.errors {
  align-self: center;
}
.server-avatar {
  align-self: center;
  margin: 10px;
}
.top {
  display: flex;
  align-self: center;
  margin-top: 10px;
  justify-content: center;
  background-color: #06454d;

  .avatar {
    display: flex;
    flex-direction: column;
    height: 100%;
    flex-shrink: 0;
    .server-avatar {
      height: 100%;
      margin-top: 35px;
    }
    .button {
      margin-bottom: 10px;
    }
  }
  .banner {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-self: center;
    flex-shrink: 0;
    margin-top: 10px;
    padding: 5px;
    margin-left: 2px;
    .banner-image {
      position: relative;
      width: 240px;
      height: 150px;
      background: rgba(0, 0, 0, 0.4);
      background-position: center;
      background-size: cover;
      .banner-text {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        width: 100%;
        height: 35px;
        backdrop-filter: blur(15px);
        background: rgba(0, 0, 0, 0.5);
      }
    }
  }
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
  background-color: #06454d;
  padding: 10px;
  align-self: center;
  margin: 10px;
  flex-shrink: 0;
}
.input input {
  margin-top: 2px;
  margin-bottom: 0;
  width: 190px;
  background: #05353b;
}
.button {
  background: #05353b;
  padding: 10px;
  align-self: center;
  margin: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
}
.button:hover {
  background: #0f292c;
}
.save-button {
  margin-top: 10px;
}
.save-button.disabled {
  background: rgba(0, 0, 0, 0.692);
}

.hidden {
  display: none;
}
@media (max-width: 390px) {
  .top {
    flex-direction: column;
    flex-shrink: 0;
    .avatar {
      height: initial;
    }
  }
}
</style>



