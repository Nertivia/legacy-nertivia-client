<template>
  <div class="profile-popout">
    <div class="triangle" />
    <div class="inner">
      <profile-picture
        v-if="user"
        class="avatar"
        :avatar="user.avatar"
        :uniqueID="user.uniqueID"
        :admin="user.admin"
        :hover="true"
        size="40px"
        emote-size="17px"
      />
      <div class="information">
        <div class="username">{{ user.username }}</div>
        <div class="tag">:{{ user.tag }}</div>
      </div>
      <div class="buttons">
        <i class="material-icons warn" @click="logOut">exit_to_app</i>
        <i class="material-icons" @click="openApp">message</i>
      </div>
    </div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
export default {
  components: { ProfilePicture },
  props: ["user"],
  methods: {
    openApp() {
      window.location.href = "/app";
    },
    logOut() {
      this.$emit("logout");
    }
  }
};
</script>

<style scoped>
.profile-popout {
  position: absolute;
  display: flex;
  flex-direction: column;
  right: 3px;
  top: 75px;
}
.triangle {
  position: absolute;
  right: 30px;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 15px solid rgba(0, 0, 0, 0.7);
}
.inner {
  right: 0;
  top: 15px;
  position: absolute;
  display: flex;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  border-radius: 5px;
  width: 300px;
  height: 60px;
  padding: 10px;
  align-items: center;
}
.avatar {
  margin-left: 10px;
}
.information {
  margin-left: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.username {
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  height: 17px;
}
.tag {
  color: rgb(163, 163, 163);
}
.buttons {
  display: flex;
  margin: 5px;
}
.buttons .material-icons {
  display: block;
  margin: 5px;
  color: rgba(255, 255, 255, 0.651);
  transition: 0.3s;
  cursor: default;
  font-size: 27px;
  user-select: none;
  cursor: pointer;
}
.buttons .material-icons:hover {
  color: white;
}
.buttons .warn {
  color: rgba(255, 0, 0, 0.651);
}
.buttons .warn:hover {
  color: rgba(255, 0, 0, 0.795);
}
@media (max-width: 342px) {
  .inner {
    left: 0;
    right: 0;
    width: 100%;
  }
  .profile-popout {
    left: 0;
    right: 20px;
  }
}
</style>
