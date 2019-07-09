<template>
  <div class="my-profile-panel">
    <div class="general-information">
      <profile-picture
        class="avatar"
        :url="avatar"
        :admin="user.admin"
        size="100px"
        emote-size="30px"
        animation-padding="5px"
      />
      <div class="information">
        <div class="username">
          <strong>Username:</strong>
          {{ user.username }}
        </div>
        <div class="tag">
          <strong>Tag:</strong>
          @{{ user.tag }}
        </div>
      </div>
      <div class="options">
        <input
          ref="avatarBrowser"
          type="file"
          accept="image/*"
          class="hidden"
          @change="avatarBrowse"
        >
        <div
          class="option"
          @click="editAvatarBtn"
        >
          Edit Avatar
        </div>
        <div
          class="option"
          @click="changePassword"
        >
          Change Password
        </div>
        <div
          class="option red"
          @click="logout"
        >
          Logout
        </div>
      </div>
    </div>
    <survey />
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

import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import Survey from "./survey.vue";
import AvatarUpload from "@/services/AvatarUpload.js";
import config from "@/config.js";
import { bus } from "@/main";
import path from "path";
import { mapState } from "vuex";

export default {
  components: {
    ProfilePicture,
    Survey
  },
  data() {
    return {
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
      } else if (file.size >= 10490000) {
        // 10490000 = 10mb
        this.alert.content =
          "Upload failed - Image size must be less than 10 megabytes.";
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
    logout() {
      this.$store.dispatch("logout");
      window.location.href = "/";
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

.hidden {
  display: none;
}
.my-profile-panel {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  overflow: auto;
}
.general-information {
  display: flex;
  width: 100%;
  margin-top: 20px;
  flex-shrink: 0;
}
.avatar {
  display: flex;
  margin-left: 20px;
}

.information {
  margin: auto;
  margin-left: 20px;
  margin-right: 0;
  font-size: 18px;
  flex: 1;
}
.username {
  margin-bottom: 10px;
}
.options {
  margin: auto;
  margin-right: 30px;
  border-left: solid 1px rgb(204, 204, 204);
  padding-left: 10px;
}
.option {
  color: rgb(218, 218, 218);
  cursor: default;
  user-select: none;
  transition: 0.3s;
}
.option:hover {
  color: rgb(255, 255, 255);
}

.option.red {
  color: rgba(255, 0, 0, 0.678);
}
.option.red:hover {
  color: red;
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
@media (max-width: 815px) {
  .general-information {
    flex-direction: column;
  }
  .avatar{
    align-self: center;
    margin: 0;
    margin-bottom: 10px;
  }
  .information {
    margin: auto;
    text-align: center;
  }
  .options {
    margin: auto;
    margin-top: 20px;
    text-align: center;
    border: none;
  }
}
</style>
