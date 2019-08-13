<template>
  <div id="app">
    <vue-headful title="Nertivia" description="Nertivia Chat Client" />
    <div ref="backgroundImage" class="background-image" />
    <spinner v-if="!showPage" />
    <div v-if="showPage" class="content">
      <transition name="fall-down" appear>
        <div class="header">
          <div class="logo" />
          <div class="name">Nertivia</div>
          <div class="links">
            <div v-if="!loggedIn" class="link" @click="signupPage">Sign up</div>
            <div v-if="!loggedIn" class="link" @click="loginPage">Login</div>
            <spinner v-if="loggedIn && !user" class="spinner-profile" :size="50" />
            <profile-picture
              v-if="loggedIn && user"
              class="avatar"
              :hover="true"
              :url="avatarDomain + user.avatar"
              :admin="user.admin"
              size="40px"
              emote-size="17px"
              @click.native="showProfilePopout = !showProfilePopout"
            />
            <transition name="fall-down-fast">
              <profile-popout
                v-if="user && loggedIn && showProfilePopout"
                v-click-outside="closeProfilePopout"
                :user="user"
                @logout="logOut"
              />
            </transition>
          </div>
        </div>
      </transition>
      <transition name="side-in" appear>
        <div class="inner-content">
          <div
            class="title"
          >The best chat client that won't restrict you from important and fun features.</div>
          <img class="graphic" src="@/assets/graphics/HomeGraphics2.png" />
          <div class="buttons">
            <div class="button" @click="openApp">Open In Browser</div>
            <div class="button download" @click="showDownloadsPopout = true">Download App</div>
          </div>
          <div class="features-list">
            <div class="title">Things you can do in Nertivia</div>
            <div class="list">
              <div class="feature">
                <i class="material-icons">insert_drive_file</i>
                <div class="description">1GB per file limit, upload huge files!</div>
              </div>
              <div class="feature">
                <i class="material-icons">face</i>
                <div class="description">Free custom gif emojis and profile picture.</div>
              </div>
              <div class="feature">
                <i class="material-icons">storage</i>
                <div class="description">Make your own servers with channels.</div>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </div>
    <div class="popouts">
      <transition name="fade">
        <download-app-popout v-if="showDownloadsPopout" @close="showDownloadsPopout = false"/>
      </transition>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import ProfilePicture from "@/components/ProfilePictureTemplate.vue";
import ProfilePopout from "@/components/homePage/ProfilePopout.vue";
import DownloadAppPopout from "@/components/homePage/DownloadAppPopout.vue";
import AuthenticationService from "@/services/AuthenticationService.js";
import config from "@/config.js";

export default {
  components: { Spinner, ProfilePicture, ProfilePopout, DownloadAppPopout },
  data() {
    return {
      showDownloadsPopout: false,
      showProfilePopout: false,
      showPage: false,
      loggedIn: localStorage.getItem("hauthid") || null,
      user: null,
      avatarDomain: config.domain + "/avatars/"
    };
  },
  async mounted() {
    if (this.loggedIn) this.getUser();
    this.preloadImages();
  },
  methods: {
    closeProfilePopout(event) {
      if (!event.target.closest(".avatar")) this.showProfilePopout = false;
    },
    logOut() {
      this.$store.dispatch("logout");
      this.loggedIn = null;
    },
    loginPage() {
      window.location.href = "/login";
    },
    signupPage() {
      window.location.href = "/register";
    },
    openApp() {
      window.location.href = "/app";
    },
    async imagePreloader(srcArray) {
      srcArray.forEach(async element => {
        await wrapper(element);
      });
      function wrapper(src) {
        return new Promise(resolve => {
          const image = new Image();
          image.src = src;
          image.onload = () => resolve("done");
        });
      }
    },
    async preloadImages() {
      await this.imagePreloader([
        require("@/assets/logo.png"),
        require("@/assets/graphics/HomeGraphics2.png")
      ]);
      const src = require("@/assets/background.jpg");
      const background = new Image();
      setTimeout(() => {
        background.src = src;
        background.onload = () => {
          this.$refs.backgroundImage.style.backgroundImage = `url(${background.src})`;
          this.$refs.backgroundImage.style.opacity = 0.7;
          setTimeout(() => (this.showPage = true), 500);
        };
      }, 500);
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
  }
};
</script>


<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.fall-down-enter-active {
  opacity: 0;
  animation: fall-down 0.5s;
  animation-delay: 0.3s;
}

.fall-down-fast-enter-active {
  opacity: 0;
  animation: bounce-in 0.2s;
}
.fall-down-fast-leave-active {
  opacity: 0;
  animation: bounce-in 0.2s reverse;
}

@keyframes fall-down {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  50% {
    transform: translateY(10px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes bounce-in {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  50% {
    transform: translateY(10px);
    opacity: 1;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}

.side-in-enter-active {
  opacity: 0;
  animation: side-in 0.5s;
  animation-delay: 0.5s;
}

@keyframes side-in {
  0% {
    transform: translateX(-20px);
    opacity: 0;
  }
  50% {
    transform: translateX(10px);
    opacity: 1;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

html,
body {
  height: 100%;
}
#app {
  display: flex;
  flex-direction: column;
  height: 100%;
}
.header {
  background: rgba(0, 0, 0, 0.52);
  display: flex;
  height: 70px;
  margin: 5px;
  border-radius: 10px;
  flex-shrink: 0;
  border: 10px;
  position: relative;
}
.logo {
  background-image: url("../assets/logo.png");
  background-size: 100%;
  height: 50px;
  width: 50px;
  margin-top: auto;
  margin-bottom: auto;
  margin-left: 10px;
  background-repeat: no-repeat;
}
.name {
  margin-top: auto;
  margin-bottom: auto;
  font-size: 20px;
  margin-left: 10px;
  color: white;
}

.background-image {
  z-index: -1;
  position: fixed;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;
  opacity: 0;
  transition: 0.5s;
}
.content {
  position: fixed;
  width: 100%;
  height: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: auto;
  overflow-x: hidden;
}

.inner-content {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  flex: 1;
  margin-top: 40px;
}
.graphic {
  width: 700px;
  height: auto;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 0;
  user-select: none;
  flex-shrink: 0;
}
.title {
  font-size: 25px;
  color: white;
  text-align: center;
  padding: 10px;
  flex-shrink: 0;
}
.buttons {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  flex-shrink: 0;
}
.button {
  padding: 15px;
  background: rgba(24, 132, 255, 0.733);
  border-radius: 5px;
  color: white;
  box-shadow: 3px 3px rgb(5, 86, 179);
  user-select: none;
  transition: 0.3s;
  margin: 10px;
}

.button:hover {
  background: rgb(24, 132, 255);
}
.button:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 rgb(5, 86, 179);
}

.button.download {
  background: rgba(0, 223, 67, 0.733);
  box-shadow: 3px 3px rgb(0, 121, 36);
}


.button.download:hover {
  background: rgba(0, 223, 67, 0.777);
}
.button.download:active {
  transform: translate(3px, 3px);
  box-shadow: 0 0 rgb(0, 121, 36);
}


.features-list {
  margin-top: 20px;
}
.features-list .list {
  display: flex;
  justify-content: center;
}
.feature {
  background: rgba(0, 0, 0, 0.541);
  color: white;
  margin: 10px;
  padding: 2px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  justify-content: center;
  height: 200px;
  width: 200px;
  border-radius: 10px;
  flex-shrink: 0;
  transition: 0.3s;
}
.feature .description {
  width: 150px;
  margin-top: 15px;
}
.feature .material-icons {
  font-size: 60px;
}
.links {
  color: white;
  margin: auto;
  margin-right: 20px;
  display: flex;
}
.link {
  padding: 5px;
  background: rgba(0, 0, 0, 0.219);
  border-radius: 5px;
  user-select: none;
  margin-left: 5px;
  transition: 0.3s;
}
.link:hover {
  background: rgba(255, 255, 255, 0.26);
}
.warn {
  color: red;
}

@media (max-width: 1000px) {
  .graphic {
    width: calc(100% - 30px);
  }
}

@media (max-width: 662px) {
  .feature {
    margin: 5px;
    padding: 0px;
    height: 150px;
    width: 150px;
  }
}

@media (max-width: 334px) {
  .buttons {
    flex-direction: column;
  }
  .buttons .button {
    text-align: center;
  }
}

@media (max-width: 465px) {
  .features-list .list {
    flex-direction: column;
  }
  .feature {
    margin: 5px;
    padding: 0px;
    height: 150px;
    width: auto;
    font-size: 15px;
  }
  .feature .description {
    margin-top: 15px;
    width: 100%;
  }
}
</style>

<style>
body {
  background: rgb(46, 37, 49);
}
</style>
