<template>
  <div id="app">
    <div class="app-content">
      <header-login />
      <div class="content">
        <transition appear name="fade-up">
          <div class="box">
            <div class="loading" v-if="showSpinner">
              <spinner />
              <div class="text">Linking...</div>
            </div>
            <div class="loading" v-if="showSuccess">
              <div class="text">
                Your Google Drive has been linked with your Nertivia account!
              </div>
              <div class="text">You may close this tab.</div>
            </div>
            <div class="loading" v-if="error">
              <div class="text">
                Something went wrong while linking your Google Drive with
                Nertivia.
              </div>
              <div class="text">Please try again later.</div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderLogin from "@/components/global/HeaderLoginTemplate.vue";
import Spinner from "@/components/global/Spinner.vue";
import settingsService from "../services/settingsService.js";

export default {
  components: { HeaderLogin, Spinner },
  data() {
    return {
      showSpinner: true,
      error: false,
      showSuccess: false
    };
  },
  async mounted() {
    const url = new URL(location.href);
    const token = url.searchParams.get("state");
    const code = url.searchParams.get("code");
    const { ok } = await settingsService.GDriveAuth(code, token);
    if (!ok) {
      this.showSpinner = false;
      this.error = true;
    } else {
      this.showSpinner = false;
      this.showSuccess = true;
    }
  },
  methods: {}
};
</script>

<style>
html,
body {
  height: 100%;
}
</style>

<style scoped lang="scss">
@import "@/styles/global";
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
  overflow: hidden;
  background: $bg-color;
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
  transition: 0.3s;
  margin: auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
}

.loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.loading div {
  text-align: center;
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
}
.red {
  background: rgba(117, 10, 10, 0.774);
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
