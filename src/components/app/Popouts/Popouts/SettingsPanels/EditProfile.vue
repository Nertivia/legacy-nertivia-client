<template>
  <div class="edit-profile">
    <div class="inner-content">
      <div class="left">
        <div class="outer-input">
          <div class="title">Username</div>
          <div class="user-tag">
            <input type="text" class="username" value="Fishie" />
            <input type="text" class="tag" value="#awr3" />
          </div>
        </div>
        <div class="outer-input">
          <div class="title">Email</div>
          <input type="text" value="Fishie" />
        </div>
        <div class="outer-input">
          <div class="title">Current Password</div>
          <input type="password" value="fsfsdf" />
        </div>
      </div>

      <div class="change-avatar">
        <div class="change-avatar-container">
          <profile-picture
            class="avatar"
            :url="avatar"
            :admin="user.admin"
            size="100px"
            emote-size="30px"
            animation-padding="5px"
          />
          <div class="button">Change Avatar</div>
        </div>
      </div>
    </div>
    <div class="button save-button">Update</div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import userService from "@/services/userService.js";
import config from "@/config.js";

export default {
  components: { ProfilePicture },
  data() {
    return {};
  },
  methods: {},
  async mounted() {},
  computed: {
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
  padding-bottom: 40px;
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


.button {
  background: rgb(0, 119, 255);
  padding: 10px;
  text-align: center;
  border-radius: 5px;
  display: inline-block;
  align-self: center;
  cursor: pointer;
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
  position: absolute;
  z-index: 99999;
  bottom: 0;
  width: 100%;
  align-self: initial;
  display: block;
  padding: 10px 0px 10px 0px;
  margin: 0;
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