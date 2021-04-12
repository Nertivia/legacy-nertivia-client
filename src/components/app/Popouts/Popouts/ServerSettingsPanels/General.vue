<template>
  <div class="content server-general">
    <errors-list-template :errors="errors" v-if="errors" />
    <div class="content-inner" :key="key">
      <div class="top">
        <div class="avatar">
          <profile-picture
            class="server-avatar"
            size="100px"
            :hover="true"
            :id="server.server_id"
            :url="update.avatar"
            :avatar="update.avatar ? null : server.avatar"
          />
          <div class="button" @click="$refs.avatarBrowser.click()">
            Edit Avatar
          </div>
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
            :style="{
              backgroundImage: `url(${update.banner ||
                `${imageDomain}${server.banner}`})`
            }"
          ></div>
          <div class="button" @click="$refs.bannerBrowser.click()">
            Edit Banner
          </div>
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
          <custom-input
            theme="light"
            class="input"
            type="text"
            @input="inputEvent('name', $event)"
            :default-value="server.name"
            name="Server Name"
          />
          <drop-down
            :items="channels"
            :selected-item="defaultChannel"
            name="Default Channel"
            @change="changeEvent('default_channel_id', $event.channelID)"
          />
        </div>
        <div
          class="button save-button"
          :class="{ disabled: requestSent }"
          v-if="changed"
          @click="updateServer()"
        >
          {{ requestSent ? "Saving..." : "Save Changes" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import config from "@/config.js";
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import ErrorsListTemplate from "@/components/app/errorsListTemplate";
import CustomInput from "@/components/global/CustomInput";
import ServerService from "@/services/ServerService";
import DropDown from "./DropDownMenu";
import path from "path";

export default {
  components: { DropDown, ProfilePicture, ErrorsListTemplate, CustomInput },
  data() {
    return {
      imageDomain: config.nertiviaCDN,
      requestSent: false,
      changed: false,
      errors: null,
      avatarDomain: "",
      bannerDomain: "",
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
      const { ok, error } = await ServerService.updateServer(
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
    imageChangeEvent(type) {
      const file = event.target.files[0];
      const _this = this;
      const maxSize = 5092000;
      event.target.value = "";
      if (file.size > maxSize) {
        return this.$store.dispatch(
          "setGenericMessage",
          "Image is larger than 5MB"
        );
      }
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  flex-shrink: 0;

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
      background: rgba(0, 0, 0, 0.2);
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
    .button {
      background: rgba(0, 0, 0, 0.2);
    }
    .banner-image {
      position: relative;
      width: 250px;
      height: 130px;
      background: rgba(0, 0, 0, 0.4);
      background-position: center;
      background-size: cover;
      border-radius: 4px;
      box-shadow: 0px 2px 12px rgba(0, 0, 0, 0.13);
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

.input-title {
  font-size: 14px;
  margin-left: 2px;
}
.button {
  background: linear-gradient(
    137deg,
    rgba(45, 136, 255, 1) 0%,
    rgba(87, 160, 255, 1) 100%
  );
  opacity: 0.8;
  border-radius: 4px;
  padding: 10px;
  align-self: center;
  margin: 5px;
  cursor: pointer;
  user-select: none;
  transition: 0.3s;
}
.button:hover {
  opacity: 1;
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
.input {
  margin: 10px;
  margin-left: 0;
  width: 230px;
}
@media (max-width: 390px) {
  .top {
    flex-direction: column;
    .avatar {
      height: initial;
    }
  }
}
</style>
