<template>
  <div class="header">
    <img class="logo" src="@/assets/transparentLogo.svg" alt />
    <div class="title">Nertivia</div>
    <div class="buttons" v-if="!loggedIn">
      <a href="/login" class="button">Log In</a>
      <div class="button join" @click="$emit('registerButton')">
        Join Nertivia
      </div>
    </div>
    <div class="profile" v-if="loggedIn">
      <spinner v-if="loggedIn && !user" class="spinner-profile" :size="50" />
      <profile-picture
        v-if="loggedIn && user"
        class="avatar"
        :hover="true"
        :avatar="user.avatar"
        :uniqueID="user.uniqueID"
        :admin="user.admin"
        size="40px"
        emote-size="17px"
        @click.native="showProfilePopout = !showProfilePopout"
      />
      <div class="details" v-if="loggedIn && user">
        <div class="username">{{ user.username }}</div>
        <div class="tag">:{{ user.tag }}</div>
      </div>
      <transition name="fall-down-fast">
        <profile-popout
          v-if="user && loggedIn && showProfilePopout"
          v-click-outside="closeProfilePopout"
          :user="user"
          @logout="
            loggedIn = null;
            user = null;
          "
        />
      </transition>
    </div>
  </div>
</template>

<script>
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import ProfilePopout from "@/components/homePage/ProfileContext.vue";
import Spinner from "@/components/global/Spinner.vue";
import AuthenticationService from "../../services/AuthenticationService";
export default {
  components: { Spinner, ProfilePicture, ProfilePopout },
  data() {
    return {
      showProfilePopout: false,
      loggedIn: localStorage.getItem("hauthid") || null,
      user: null
    };
  },
  methods: {
    closeProfilePopout(event) {
      if (!event.target.closest(".avatar")) this.showProfilePopout = false;
    },
    async getUser() {
      const { ok, error, result } = await AuthenticationService.user();
      if (!ok) {
        // connection error
        if (error.response === undefined) {
          setTimeout(() => {
            this.getUser();
          }, 5000);
          return;
        } else {
          localStorage.removeItem("hauthid");
          this.loggedIn = null;
        }
      } else {
        this.user = result.data.user;
      }
    }
  },
  mounted() {
    if (this.loggedIn) {
      this.getUser();
    }
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global";

.fall-down-fast-enter-active,
.fall-down-fast-leave-active {
  transition: 0.2s;
}
.fall-down-fast-enter, .fall-down-fast-leave-to /* .fade-leave-active below version 2.1.8 */ {
  transform: translateY(-20px);
  opacity: 0;
}

.header {
  display: flex;
  height: 60px;
  width: 100%;
  align-content: center;
  align-items: center;
  flex-shrink: 0;
}
.buttons {
  display: flex;
  margin: auto;
  margin-right: 10px;
}
.button {
  padding: 10px;
  border-radius: 4px;
  color: rgba(87, 160, 255, 1);
  text-decoration: none;
  user-select: none;
  margin: 5px;
  cursor: pointer;
  &.join {
    box-shadow: 0 0 5px 0 black;
    color: white;
    background: $primary-button-color;
    transition: 0.2s;
    &:hover {
      opacity: 0.8;
    }
  }
}
.profile {
  margin: auto;
  margin-right: 20px;
  display: flex;
  align-items: center;
  align-content: center;
  .avatar {
    margin-right: 10px;
  }
  .details {
    font-size: 14px;
  }
  .tag {
    opacity: 0.7;
  }
}
.logo {
  margin-left: 20px;
  margin-right: 10px;
  height: 50px;
  width: 50px;
}
@media (max-width: 374px) {
  .logo {
    display: none;
  }
  .title {
    display: none;
  }
}
</style>
