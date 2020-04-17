<template>
  <div id="app">
    <div class="app-content">
      <header-login />
      <div class="content">
        <transition appear name="fade-up">
          <div :class="{ box: true, red: server === undefined }">
            <spinner v-if="server === null" />
            <div v-if="server === undefined">
              <div class="invalid">{{ errorMsg }}</div>
            </div>
            <div v-if="server" class="server">
              <profile-picture
                class="avatar"
                size="100px"
                :avatar="server.avatar"
                :hover="true"
              />
              <div class="server-name">{{ server.name }}</div>
              <div class="buttons">
                <div
                  v-if="loggedIn"
                  class="button join-button"
                  @click="joinServerButton"
                >
                  Join {{ server.name }}
                </div>
                <div v-else class="button join-button" @click="loginButton">
                  Login to join
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderLogin from "@/components/global/HeaderLoginTemplate.vue";
import ProfilePicture from "@/components/global/ProfilePictureTemplate.vue";
import Spinner from "@/components/global/Spinner.vue";
import ServerService from "@/services/ServerService";
export default {
  components: { HeaderLogin, Spinner, ProfilePicture },
  data() {
    return {
      server: null,
      loggedIn: localStorage.getItem("hauthid"),
      errorMsg: ""
    };
  },
  async mounted() {
    const inviteID = this.$route.params.invite_id;
    const { ok, error, result } = await ServerService.getInviteDetail(inviteID);
    if (ok) {
      this.server = result.data;
    } else {
      if (error.response === undefined) {
        this.errorMsg = "Cannot connect to server. Try again later.";
      } else {
        this.errorMsg =
          "The invite code is either invalid, expired or blocked.";
      }
      this.server = undefined;
    }
  },
  methods: {
    async joinServerButton(event) {
      if (event.target.classList.contains("button-clicked")) return;
      event.target.classList.add("button-clicked");
      const inviteID = this.$route.params.invite_id;
      if (!localStorage.getItem("hauthid")) {
        return (this.loggedIn = undefined);
      }
      const { ok, error } = await ServerService.joinServer(inviteID);
      if (ok) {
        this.$router.push(`/app`);
      } else {
        event.target.classList.remove("button-clicked");
        //409 404
        if (error.response === undefined) {
          this.errorMsg = "Cannot connect to server. Try again later.";
        } else {
          const status = error.response.status;
          if (status === 409) {
            return this.$router.push(`/app`);
          }
          if (status === 404) {
            return (this.errorMsg = "Invite does not exist.");
          }
          this.errorMsg = "Something went wrong. Try again later.";
        }
        this.server = undefined;
      }
    },
    loginButton() {
      const inviteID = this.$route.params.invite_id;
      this.$router.push(`/login?to=invites&id=${inviteID}`);
    }
  }
};
</script>

<style>
html,
body {
  height: 100%;
}
</style>

<style scoped>
.fade-up-enter-active {
  opacity: 0;
  animation: bounce-in 0.5s;
  animation-delay: 0.7s;
}
.fade-up-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: translateX(30px);
    opacity: 0;
  }
  50% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}
#app {
  display: flex;
  flex-direction: column;
  color: white;
  height: 100%;
  background: linear-gradient(to bottom, #005799 0, #0076d1);
}
.app-content {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: 9999;
  padding-bottom: 100px;
}
.content {
  display: flex;
  height: 100%;
  margin: 10px;
  flex-shrink: 0;
}
.box {
  width: 100%;
  max-width: 400px;
  margin: auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding-bottom: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
}
.server {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  height: 300px;
}
.invalid {
  margin-top: 15px;
  align-items: center;
  align-content: center;
  text-align: center;
}

.avatar {
  align-self: center;
  margin-bottom: 10px;
}

.server-name {
  text-align: center;
  font-size: 25px;
  margin-bottom: 40px;
}

.button {
  padding: 10px;
  background: rgba(25, 151, 255, 0.699);
  user-select: none;
  border: none;
  color: white;
  font-size: 17px;
  outline: none;
  transition: 0.2s;
  align-self: center;
  flex-shrink: 0;
  text-align: center;
  cursor: pointer;
  border-radius: 4px;
}
.button:hover {
  background: rgb(25, 151, 255);
}
.button:focus {
  background: rgb(25, 151, 255);
}

.button-clicked {
  background: rgb(126, 126, 126) !important;
}
</style>
