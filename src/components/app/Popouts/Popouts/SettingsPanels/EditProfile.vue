<template>
  <div class="edit-profile">
    <errors-list-template :errors="errors" v-if="errors" />
    <div class="centered-box">
      <div class="information">
        <input
          ref="avatarBrowser"
          type="file"
          accept=".jpeg, .jpg, .png, .gif"
          style="display: none"
          @change="avatarChangeEvent"
        />
        <profile-picture
          class="avatar"
          @click.native="$refs.avatarBrowser.click()"
          :url="update.avatar"
          :uniqueID="user.uniqueID"
          :avatar="update.avatar ? null : avatar"
          :badges="user.badges"
          size="90px"
          :hover="true"
          emote-size="27px"
          animation-padding="4px"
        />
        <div class="details">
          <div class="username">
            <span>{{ user.username }}</span>
            <span class="tag">:{{ user.tag }}</span>
          </div>
          <div class="email">{{ user.email }}</div>
        </div>
      </div>
      <div class="edit-information">
        <div class="username-tag">
          <custom-input
            theme="light"
            class="input"
            type="text"
            @input="inputEvent('username', $event)"
            :default-value="user.username"
            name="Username"
          />
          <custom-input
            theme="light"
            class="input tag"
            type="text"
            @input="inputEvent('tag', $event)"
            :default-value="user.tag"
            name="Tag"
          />
        </div>

        <custom-input
          theme="light"
          class="input"
          type="email"
          @input="inputEvent('email', $event)"
          :default-value="user.email"
          name="Email"
        />
        <custom-input
          theme="light"
          class="input current-password"
          type="password"
          @input="inputEvent('password', $event)"
          autocomplete="new-password"
          name="Current Password"
        />
        <custom-input
          theme="light"
          v-if="resetPassword"
          class="input current-password"
          type="password"
          @input="inputEvent('new_password', $event)"
          autocomplete="new-password"
          name="New Password"
        />
      </div>
      <div class="link" v-if="!resetPassword" @click="resetPassword = true">
        Reset Password
      </div>
      <div class="link" @click="linkGoogleDrive">Re-link Google Drive</div>
      <div
        class="button save-button"
        :class="{ disabled: requestSent }"
        @click="updateProfile"
        v-if="changed"
      >
        {{ requestSent ? "Saving..." : "Update" }}
      </div>
    </div>

    <div style="display: none">
      <errors-list-template :errors="errors" v-if="errors" />
      <div class="inner-content">
        <div class="left">
          <form :key="key">
            <div class="outer-input">
              <div class="title">Username</div>
              <div class="user-tag">
                <input
                  type="text"
                  class="username"
                  :default-value.prop="user.username"
                  @input="inputEvent('username', $event)"
                />

                <input
                  type="text"
                  class="tag"
                  :default-value.prop="user.tag"
                  @input="inputEvent('tag', $event)"
                />
              </div>
            </div>
            <div class="outer-input">
              <div class="title">Email</div>
              <input
                type="email"
                autocomplete="off"
                :default-value.prop="user.email"
                @input="inputEvent('email', $event)"
              />
            </div>
            <div class="outer-input">
              <div class="title">Current Password</div>
              <input
                type="password"
                autocomplete="new-password"
                ref="passwordInput"
                @input="inputEvent('password', $event)"
              />
            </div>
            <div
              class="link"
              v-if="!resetPassword"
              @click="resetPassword = true"
            >
              Reset Password
            </div>
            <div class="outer-input" v-if="resetPassword">
              <div class="title">New Password</div>
              <input
                type="password"
                autocomplete="new-password"
                @input="inputEvent('new_password', $event)"
              />
            </div>
            <div class="link" @click="linkGoogleDrive">
              Re-link Google Drive
            </div>
          </form>
        </div>

        <div class="change-avatar">
          <div class="change-avatar-container">
            <profile-picture
              class="avatar"
              :url="update.avatar"
              :uniqueID="user.uniqueID"
              :avatar="update.avatar ? null : avatar"
              :badges="user.badges"
              size="70px"
              :hover="true"
              emote-size="24px"
              animation-padding="4px"
            />
          </div>
        </div>
      </div>
      <div
        class="button save-button"
        :class="{ disabled: requestSent }"
        @click="updateProfile"
        v-if="changed"
      >
        {{ requestSent ? "Saving..." : "Update" }}
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import CustomInput from "@/components/global/CustomInput";
import userService from "@/services/userService.js";
import ErrorsListTemplate from "@/components/app/errorsListTemplate";
import path from "path";

export default {
  components: { ProfilePicture, ErrorsListTemplate, CustomInput },
  data() {
    return {
      errors: null,
      requestSent: false,
      changed: false,
      resetPassword: false,
      update: {},
      key: 0
    };
  },
  methods: {
    inputEvent(name, event) {
      this.$set(this.update, name, event.target.value);
    },
    avatarChangeEvent(event) {
      const file = event.target.files[0];
      const _this = this;
      const maxSize = 8092000;
      if (file.size > maxSize) {
        return this.$store.dispatch(
          "setGenericMessage",
          "Image is larger than 8MB"
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
        _this.$set(_this.update, "avatar", reader.result);
      };
      reader.onerror = function(error) {
        console.log("Error: ", error);
        return this.$store.dispatch(
          "setGenericMessage",
          "Something went wrong. Try again later."
        );
      };
    },
    async updateProfile() {
      if (this.requestSent) return;
      this.errors = null;
      this.requestSent = true;
      const { ok, error, result } = await userService.update(
        this.update,
        this.$socket.client.id
      );
      if (!ok) {
        if (error.response === undefined) {
          this.errors = { message: "Cant connect to server" };
          return;
        }
        const data = error.response.data;
        if (data.message) {
          this.errors = [{ msg: data.message }];
          return;
        }
        this.errors = data.errors;
      } else {
        if (result.data.token) {
          this.$store.dispatch("token", result.data.token);
        }
        this.$refs["passwordInput"].value = "";
        this.resetPassword = false;
        this.$set(this, "update", {});
        this.key = Math.random();
      }
      this.requestSent = false;
    },
    linkGoogleDrive() {
      this.$store.dispatch("setPopoutVisibility", {
        name: "GDLinkMenu",
        visibility: true
      });
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
    avatar() {
      return this.user.avatar;
    },
    user() {
      return this.$store.getters.user;
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
.edit-profile {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}
.centered-box {
  display: flex;
  flex-direction: column;
  max-width: 521px;
  width: 100%;
  margin: auto;
  overflow: auto;
}
.information {
  display: flex;
  align-items: center;
  margin: 10px;
  margin-bottom: 40px;
  .details {
    margin-left: 20px;
    .username {
      margin-bottom: 10px;
      font-size: 20px;
    }
    .tag {
      opacity: 0.7;
    }
    .email {
      opacity: 0.7;
    }
  }
}
.edit-information {
  display: flex;
  flex-wrap: wrap;
  .username-tag {
    display: flex;
    .input {
      margin-right: 0;
      width: 190px;
      &.tag {
        width: 50px;
        margin-left: 1px;
        margin-right: 10px;
      }
    }
  }
  .input {
    width: 240px;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: 20px;
  }
}
.button.save-button {
  background: $primary-button-color;
  border-radius: 4px;
  cursor: pointer;
  user-select: none;
  align-self: center;
  padding: 10px;
  transition: 0.2s;
  margin-top: 10px;
  opacity: 0.8;
  &:hover {
    opacity: 1;
  }
}
.link {
  color: rgba(255, 255, 255, 0.7);
  transition: 0.2s;
  cursor: pointer;
  user-select: none;
  margin: 0;
  margin-left: 10px;
  &:hover {
    color: white;
    text-decoration: underline;
  }
}

@media (max-width: 723px) {
  .edit-information {
    flex-direction: column;
    align-items: center;
    align-content: center;
  }
  .information {
    flex-direction: column;
    .details {
      text-align: center;
      margin-top: 10px;
      margin-left: 0;
    }
  }
  .link {
    align-self: center;
    margin-left: 0;
  }
}
.avatar {
  position: relative;
  &:after {
    position: absolute;
    content: "";
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0);
    transition: 0.2s;
  }
  &:hover {
    &:after {
      position: absolute;
      content: "Edit";
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      align-content: center;
      justify-content: center;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.5);
      cursor: pointer;
    }
  }
}
</style>
