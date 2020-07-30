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
              <img
                class="avatar"
                v-if="server"
                :src="mediaDomain + server.screenshot"
                alt=""
              />
              <div class="server-name">{{ server.name }}</div>
              <div class="buttons">
                <div
                  v-if="loggedIn"
                  class="button join-button"
                  @click="applyThemeButton"
                >
                  Apply Theme
                </div>
                <div v-else class="button join-button" @click="loginButton">
                  Login to Apply
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
import config from "@/config";
import HeaderLogin from "@/components/global/HeaderLoginTemplate.vue";
import Spinner from "@/components/global/Spinner.vue";
import exploreService from "../services/exploreService";
export default {
  components: { HeaderLogin, Spinner },
  data() {
    return {
      mediaDomain: config.domain + "/media/",
      server: null,
      loggedIn: localStorage.getItem("hauthid"),
      errorMsg: ""
    };
  },
  async mounted() {
    const themeID = this.$route.params.theme_id;
    const { ok, result, error } = await exploreService.getTheme(themeID, false);
    if (ok) {
      this.server = result.data;
    } else {
      if (error.response === undefined) {
        this.errorMsg = "Cannot connect to server. Try again later.";
      } else {
        this.errorMsg = "Invalid Theme.";
      }
      this.server = undefined;
    }
  },
  methods: {
    applyThemeButton() {
      localStorage.setItem("appliedThemeId", this.server.id);
      this.$router.push(`/app`);
    },
    loginButton() {
      const themeID = this.$route.params.theme_id;
      this.$router.push(`/login?to=themes&id=${themeID}`);
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
  box-shadow: 0px 0px 5px 0px #000000bd;
  background: $box-secondary-color;
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
.avatar {
  height: 170px;
  width: 300px;
  flex-shrink: 0;
  object-fit: cover;
}
</style>
