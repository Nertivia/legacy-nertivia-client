<template>
  <div class="my-profile-panel">
    <div class="tabs">
      <div class="tab" :class="{selected: tab == 0}" @click="tab = 0">Edit Profile</div>
      <div class="tab" :class="{selected: tab == 1}" @click="tab = 1">Survey</div>
    </div>
    <div class="content">
      <edit-profile v-if="tab === 0" />
      <survey v-if="tab === 1"/>
    </div>
    <div
      v-if="alert.show"
      class="alert-outer"
    >
      <div class="alert">
        <div class="alert-title">
          Error
        </div>
        <div class="alert-content">
          {{ alert.content }}
        </div>
        <div class="alert-buttons">
          <div
            class="alert-button"
            @click="alert.show = false"
          >
            Okay
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

const Survey = () => import("./survey.vue");
const EditProfile = () => import("./EditProfile.vue");

import AvatarUpload from "@/services/AvatarUpload.js";
import config from "@/config.js";
import { bus } from "@/main";
import path from "path";
import { mapState } from "vuex";

export default {
  components: {
    Survey,
    EditProfile
  },
  data() {
    return {
      tab: 0,
      alert: {
        content: "",
        show: false
      }
    };
  },
  methods: {

    onProgress(percent) {
      //update vue
      console.log("Avatar upload progress: ", percent);
    },
    async avatarBrowse(event) {
      const file = event.target.files[0];
      event.target.value = "";
      const allowedFormats = [".png", ".jpeg", ".gif", ".jpg"];

      if (!allowedFormats.includes(path.extname(file.name).toLowerCase())) {
        this.alert.content = "Upload failed - Unsupported image file.";
        return (this.alert.show = true);
      } else if (file.size >= 2092000) {
        // 2092000 = 2mb
        this.alert.content =
          "Upload failed - Image size must be less than 2 megabytes.";
        return (this.alert.show = true);
      }
      const formData = new FormData();
      formData.append("avatar", file);
      const { ok, error, result } = await AvatarUpload.uploadAvatar(
        formData,
        this.onProgress
      );
      if (!ok) {
        this.alert.content =
          "Upload failed - Something went wrong. Try again later.";
        return (this.alert.show = true);
      }
    },
    changePassword() {
      this.alert.content = "Not implemented yet.";
      return (this.alert.show = true);
    },
    editAvatarBtn() {
      if (!this.GDriveLinked) {
        return this.$store.dispatch("setPopoutVisibility", {
          name: "GDLinkMenu",
          visibility: true
        });
      }
      this.$refs.avatarBrowser.click();
    }
  },
  computed: {
    ...mapState("settingsModule", ["GDriveLinked"]),
    user() {
      return this.$store.getters.user;
    },
    avatar() {
      return config.domain + "/avatars/" + this.$store.getters.user.avatar;
    }
  }
};
</script>
<style scoped>

.tabs{
  z-index: 999999;
  display: flex;
  background: #073444;
  justify-content: center;
}
.tabs .tab {
  padding: 10px;
  margin: 3px;
  margin-bottom: 0;
  user-select: none;
  cursor: pointer;
  position: relative;
  padding-bottom: 15px;
}

.tabs .tab:after {
  content:'';
  position:absolute;
  bottom:0;
  left:0;
  right:0;
  height:5px;
  transition: 0.3s;
}


.tabs .tab:hover:after{
  background: rgb(160, 160, 160);
}
.tabs .tab.selected:after {
  background: white;
}

.content{
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
}



.hidden {
  display: none;
}
.my-profile-panel {
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: hidden;
}

.alert-title {
  background: rgb(34, 34, 34);
  font-size: 20px;
  color: white;
  padding: 10px;
}
.alert-outer {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  background: rgba(0, 0, 0, 0.267);
}
.alert {
  margin: auto;
  background: rgb(49, 49, 49);
  width: 500px;
  box-shadow: 0px 0px 30px #000000;
  display: flex;
  flex-direction: column;
  user-select: none;
  cursor: default;
}
.alert-content {
  margin: auto;
  font-size: 16px;
  color: white;
  padding: 10px;
  padding-top: 30px;
  padding-bottom: 40px;
}
.alert-buttons {
  margin-left: auto;
  margin-right: auto;
  margin-bottom: 20px;
}
.alert-button {
  color: white;
  margin: auto;
  background: rgba(73, 53, 53, 0.712);
  padding: 10px;
  transition: 0.3s;
}
.alert-button:hover {
  background: rgb(83, 53, 53);
}
</style>
