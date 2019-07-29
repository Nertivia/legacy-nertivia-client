<template>
  <div class="edit-profile">
    <div class="inner-content">
      <div class="left">
        <form>
          <div class="outer-input">
            <div class="title">Username</div>
            <div class="user-tag">
              <input type="text" class="username" :default-value.prop="user.username" @input="inputEvent('username', $event)"/>

              <input type="text" class="tag" :default-value.prop="user.tag" @input="inputEvent('tag', $event)"/>
            </div>
          </div>
          <div class="outer-input">
            <div class="title">Email</div>
            <input type="email" autocomplete="off" :default-value.prop="user.email" @input="inputEvent('email', $event)"/>
          </div>
          <div class="outer-input">
            <div class="title">Current Password</div>
            <input type="password" autocomplete="new-password" @input="inputEvent('password', $event)" />
          </div>
        </form>
      </div>

      <div class="change-avatar">
        <div class="change-avatar-container">
          <profile-picture
            class="avatar"
            :url="update.avatar || avatar"
            :admin="user.admin"
            size="100px"
            emote-size="30px"
            animation-padding="5px"
          />
          <div class="button" @click="$refs.avatarBrowser.click()">Change Avatar</div>
          <input
            ref="avatarBrowser"
            type="file"
            accept=".jpeg, .jpg, .png, .gif"
            class="hidden"
            @change="avatarChangeEvent"
          >
        </div>
      </div>
    </div>
    <div class="button save-button" :class="{disabled: requestSent}" @click="updateProfile" v-if="changed">{{requestSent ? 'Saving...' : 'Update'}}</div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import userService from "@/services/userService.js";
import config from "@/config.js";
import path from "path";

export default {
  components: { ProfilePicture },
  data() {
    return {
      requestSent: false,
      changed: false,
      update: {}
    };
  },
  methods: {
    inputEvent(name, event) {
      this.$set(this.update, name, event.target.value)
    },
    avatarChangeEvent(event) {
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
        return this.$store.dispatch('setGenericMessage', "Something went wrong. Try again later.") 
        console.log('Error: ', error);
      };
    },
    async updateProfile() {
      if (this.requestSent) return;
      this.requestSent = true;
      const {ok, result, error} = await userService.update(this.update) 
      this.requestSent = false;
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
    avatar() {
      return config.domain + "/avatars/" + this.$store.getters.user.avatar;
    },
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>

<style scoped>
.edit-profile {
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  flex: 1;
  overflow: hidden;
}
.inner-content {
  display: flex;
  flex: 1;
  overflow: auto;
  flex-shrink: 0;
}

.change-avatar {
  display: flex;
  flex-direction: column;
  flex: 1;
}
.change-avatar-container {
  display: flex;
  flex-direction: column;
  background: rgb(42, 42, 42);
  width: 150px;
  align-self: center;
  padding: 20px;
  border-radius: 10px;
  margin-top: 10px;
}
.avatar {
  margin-bottom: 10px;
  align-self: center;
}
.hidden {
  display: none;
}
.button {
  background: #5394fc;
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  display: inline-block;
  align-self: center;
  cursor: pointer;
  transition: 0.3s;
}
.disabled {
  background: grey;
}
.left {
  width: 340px;
  display: flex;
  flex-direction: column;
}

.outer-input {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: rgb(42, 42, 42);
  padding: 10px;
  border-radius: 10px;
  margin: 5px;
  margin-left: 30px;
  flex-shrink: 0;
}
.outer-input .user-tag .username {
  flex: 1;
}
.outer-input .user-tag .tag {
  border-left: solid 1px rgb(168, 168, 168);
  width: 50px;
}
.outer-input .user-tag {
  display: flex;
  overflow: hidden;
}
.outer-input input {
  width: initial;
  border-radius: 5px;
}

.save-button {
  z-index: 99999;
  width: 100%;
  align-self: initial;
  display: block;
  padding: 10px 0px 10px 0px;
  margin: 0;
  border-radius: 10px;
}


@media (max-width: 740px) {
  .inner-content {
    flex-direction: column;
  }
  .change-avatar-container {
    order: 1;
  }
  .left {
    order: 2;
    align-self: center;
    width: 280px;
  }
  .outer-input {
    margin-left: initial;
  }
}

</style>