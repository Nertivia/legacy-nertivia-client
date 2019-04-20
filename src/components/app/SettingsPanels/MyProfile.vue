<template>
  <div class="my-profile-panel">
    <div class="general-information">
      <div class="profile-picture-outer">
        <profile-picture
          :url="avatar"
          :admin="user.admin"
          size="100px"
          emoteSize="30px"
          animationPadding="5px"
        />
      </div>
      <div class="information">
        <div class="username">
          <strong>Username:</strong>
          {{user.username}}
        </div>
        <div class="tag">
          <strong>Tag:</strong>
          @{{user.tag}}
        </div>
      </div>
      <div class="options">
        <input
          type="file"
          accept="image/*"
          ref="avatarBrowser"
          @change="avatarBrowse"
          class="hidden"
        >
        <div class="option" @click="editAvatarBtn">Edit Avatar</div>
        <div class="option" @click="changePassword">Change Password</div>
        <div class="option red" @click="logout">Logout</div>
      </div>
    </div>
    <div class="title">
      <i class="material-icons">error</i>
      Take Survey
    </div>
    <div class="notice">Note: Everyone will be able to see your survey in your profile.</div>

    <div class="survey">
      <!-- name -->
      <div>
        <div class="survey-title">What's your name?</div>
        <input
          class="survey-input"
          v-model="surveySelectedItems.name"
          type="text"
          placeholder="Name"
        >
      </div>
      <!-- Gender -->
      <div class="survey-box">
        <drop-down
          name="What is your gender?"
          v-model="surveySelectedItems.gender"
          :items="surveyItems.gender"
        />
      </div>
      <!-- Age -->
      <div class="survey-box">
        <drop-down
          name="What is your age?"
          v-model="surveySelectedItems.age"
          :items="surveyItems.age"
        />
      </div>
      <!-- Continent -->
      <div class="survey-box">
        <drop-down
          name="Pick a continent"
          v-model="surveySelectedItems.continent"
          :items="surveyItems.continents"
        />
      </div>
      <!-- Countries -->
      <div class="survey-box">
        <drop-down
          name="Pick a country"
          v-if="surveySelectedItems.continent != null"
          v-model="surveySelectedItems.countries"
          :items="filterCountry"
        />
      </div>
    </div>
    <div class="alert-outer" v-if="alert.show">
      <div class="alert">
        <div class="alert-title">Error</div>
        <div class="alert-content">{{alert.content}}</div>
        <div class="alert-buttons">
          <div class="alert-button" @click="alert.show = false">Okay</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import surveyItems from "@/utils/surveyItems.js";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import DropDown from "@/components/app/SettingsPanels/DropDownTemplate.vue";
import AvatarUpload from "@/services/AvatarUpload.js";
import config from "@/config.js";
import { bus } from "@/main";
import path from "path";
import { mapState } from "vuex";

export default {
  components: {
    ProfilePicture,
    DropDown
  },
  data() {
    return {
      surveyItems,
      surveySelectedItems: {
        name: "",
        gender: null,
        age: null,
        continent: null,
        countries: null
      },
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
    filterCountry() {
      const selectedContinentIndex = this.surveySelectedItems.continent;
      const selectedContinent = this.surveyItems.continents[
        selectedContinentIndex
      ];
      const code = selectedContinent.code;
      return this.surveyItems.countries.filter(element => {
        return element.code == code;
      });
    },
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
.notice {
  color: grey;
  font-size: 15px;
  margin-top: 20px;
  margin-left: 30px;
}

.survey-title {
  margin-top: 10px;
}
.survey {
  display: flex;
  margin: auto;
  margin-top: 10px;
  flex-flow: row wrap;
  flex-direction: column;
}

.survey-input {
  height: 24px;
  padding: 10px;
  background: rgba(61, 61, 61, 0.863);
  margin-top: 5px;
}

.title {
  margin-top: 30px;
  display: flex;
  align-content: center;
  align-items: center;
  margin-left: 25px;
  font-size: 20px;
}
.title .material-icons {
  color: cyan;
  margin-right: 10px;
  font-size: 30px;
}
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
}
.profile-picture-outer {
  display: flex;
  z-index: 99999;
}
.profile-picture {
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
    display: block;
    flex-direction: column;
  }
  .profile-picture {
    margin: auto;
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
