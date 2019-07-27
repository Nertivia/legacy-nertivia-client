<template>
  <div class="edit-profile">
    <div class="left">
      <div class="outer-input">
        <div class="title">Username</div>
        <div class="user-tag">
          <input type="text" class="username" value="Fishie">
          <input type="text" class="tag" value="#awr3">
        </div>
      </div>
      <div class="outer-input">
        <div class="title">Email</div>
        <input type="text" value="Fishie">
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
</template>

<script>
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import userService from "@/services/userService.js";
import config from "@/config.js";

export default {
  components: { ProfilePicture },
  data() {
    return {

    };
  },
  methods: {

  },
  async mounted() {
   
  },
  computed: {
    avatar() {
      return config.domain + "/avatars/" + this.$store.getters.user.avatar;
    },
    user() {
      return this.$store.getters.user;
    }
  },
};
</script>

<style scoped>

.edit-profile{
  display: flex;
  margin-top: 10px;
  width: 100%;
}

.change-avatar {
  display: flex;
  flex-direction: column;
  flex: 1
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
  width: 300px;
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
  margin: 10px;
}
.outer-input .user-tag .username{ 

}
.outer-input .user-tag .tag{ 
  border-left: solid 1px rgb(168, 168, 168);
  width: 50px;
}
.outer-input .user-tag {
  display: flex;
  overflow: hidden;
}
.outer-input input {
  width: initial;
  border-radius: 5px
}

</style>