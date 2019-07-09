<template>
  <div id="app">
    <div class="app-content">
      <header-login @isDay="isDayEvent" />
      <div class="content">
        <transition
          appear
          name="fade-up"
        >
          <div :class="{box: true, red: server === undefined}">
            <spinner v-if="server === null" />
            <div v-if="server === undefined">
              <div class="invalid">
                {{ errorMsg }}
              </div>
            </div>
            <div
              v-if="server"
              class="server"
            >
              <profile-picture
                class="avatar"
                size="100px"
                :url="tempImage"
              />
              <div class="server-name">
                {{ server.name }}
              </div>
              <div class="buttons">
                <div
                  v-if="loggedIn"
                  class="button join-button"
                  @click="joinServerButton"
                >
                  Join {{ server.name }}
                </div>
                <div
                  v-else
                  class="button join-button"
                  @click="loginButton"
                >
                  Login to join
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <div class="background">
      <div :class="{background: true, 'night-background': true, chosen: !isDay}">
        <particlesJS class="particles" />
      </div>
      <div class="background day-background" />
    </div>
  </div>
</template>

<script>
import config from "@/config";
import particlesJS from "@/components/ParticlesJS.vue";
import HeaderLogin from "@/components/HeaderLoginTemplate.vue";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import Spinner from "@/components/Spinner.vue";
import ServerService from "@/services/ServerService";
export default {
  components: { HeaderLogin, particlesJS, Spinner, ProfilePicture},
  data() {
    return {
      isDay: true,
      server: null,
      tempImage: config.domain + "/avatars/noob",
      loggedIn: localStorage.getItem('hauthid'),
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
        this.errorMsg = "The invite code is either invalid, expired or blocked.";
      }
      this.server = undefined;
    }
  },
  methods: {
    isDayEvent(data) {
      this.isDay = data;
    },
    async joinServerButton(event) {
      if (event.target.classList.contains("button-clicked")) return;
      event.target.classList.add("button-clicked");
      const inviteID = this.$route.params.invite_id;
      if (!localStorage.getItem("hauthid")) {
        return this.loggedIn = undefined; 
      }
      const { ok, error, result } = await ServerService.joinServer(inviteID)
      if (ok) {
        this.$router.push(`/app`);
      } else {
        event.target.classList.remove("button-clicked");
        //409 404
        if (error.response === undefined) {
          this.errorMsg = "Cannot connect to server. Try again later.";
        } else {
          const status = error.response.status;
          if (status === 409){
            return this.$router.push(`/app`);
          }
          if (status === 404){
            return this.errorMsg = "Invite does not exist.";
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
  transition: background 10s;
  color: white;
  height: 100%;
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
.background {
  position: fixed;
  height: 100%;
  width: 100%;
  transition: background 10s;
}

.night-background {
  opacity: 0;
  transition: 10s;
  background: linear-gradient(to bottom, #000000 0%, #606060 100%) !important;
}
.day-background {
  opacity: 1;
  background: linear-gradient(to bottom, #165dc0 0%, #5482bf 100%);
  z-index: -1;
}

.night-background.chosen {
  opacity: 1 !important;
}

.night-background .particles {
  opacity: 1;
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
  background: rgba(44, 44, 44, 0.774);
  transition: 0.3s;
  margin: auto;
  margin-top: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding-bottom: 20px;
}
.server {
  display: flex;
  flex-direction: column;
  align-content: center;
  justify-content: center;

  height: 300px;
}
.invalid{
  margin-top: 15px;
}
.red{
  background: rgba(117, 10, 10, 0.774)
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
  border-radius: 5px;
  user-select: none;
  border: none;
  color: white;
  font-size: 17px;
  outline: none;
  transition: 0.2s;
  box-shadow: 3px 3px rgba(23, 112, 255, 0.479);
  align-self: center;
  flex-shrink: 0;
  text-align: center;

}
.button:hover {
  background: rgb(25, 151, 255);
}
.button:focus {
  background: rgb(25, 151, 255);
}
.button:active {
  background: rgb(25, 151, 255);
  transform: translate(3px, 3px);
  box-shadow: 0px 0px rgba(0, 97, 207, 0.479);
}

.button-clicked {
  background: rgb(126, 126, 126) !important;
  transform: translate(3px, 3px) !important;
  box-shadow: 0px 0px rgba(61, 61, 61, 0.479) !important;
}
</style>
