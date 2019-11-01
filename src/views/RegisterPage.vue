<template>
  <div id="app">
    <electron-frame-buttons v-if="isElectron" />
    <div class="app-content">
      <header-login />
      <div class="content">
        <transition appear name="fade-up">
          <div v-if="visible" class="box">
            <div class="title">
              <i class="material-icons">account_circle</i>
              Register
            </div>
            <div class="info">Welcome, new user! I Hope you enjoy Nertivia!</div>
            <form v-if="!showCaptcha" action="#" @submit.prevent="formSubmit">
              <div class="input">
                <div class="input-text">
                  Email
                  <span v-if="email.alert" class="error">- {{ email.alert }}</span>
                </div>
                <input v-model="email.value" type="email" placeholder="Email" autocomplete="off" />
              </div>

              <div class="input">
                <div class="input-text">
                  Username
                  <span v-if="username.alert" class="error">- {{ username.alert }}</span>
                </div>
                <input
                  v-model="username.value"
                  type="text"
                  placeholder="Username"
                  autocomplete="off"
                />
              </div>

              <div class="input">
                <div class="input-text">
                  Password
                  <span v-if="password.alert" class="error">- {{ password.alert }}</span>
                </div>
                <input
                  v-model="password.value"
                  type="password"
                  autocomplete="off"
                  placeholder="Password"
                />
              </div>
              <span v-if="otherError" class="error" style="text-align: center;">{{ otherError }}</span>
              <div class="buttons">
                <button
                  class="button register-button"
                  @click.prevent="loginButton"
                >I'm already a user!</button>
                <button type="submit" :class="{button: true, deactive: deactive}">Register</button>
              </div>
            </form>
            <div v-if="showCaptcha" class="captcha-box">
              <div class="input captcha-input">
                <div class="input-text">Beep Boop</div>
                <div class="captcha">
                  <Recaptcha ref="recaptcha" @verify="captchaSubmit" />
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
import Recaptcha from "@/components/Recaptcha.vue";
import HeaderLogin from "@/components/HeaderLoginTemplate.vue";

const ElectronFrameButtons = () =>
  import("@/components/ElectronJS/FrameButtons.vue");

export default {
  components: { HeaderLogin, Recaptcha, ElectronFrameButtons },
  data() {
    return {
      isElectron: window && window.process && window.process.type,

      showCaptcha: false,
      visible: true,
      email: { value: "", alert: "" },
      username: { value: "", alert: "" },
      password: { value: "", alert: "" },
      otherError: "",

      captchaToken: "",
      deactive: false
    };
  },
  methods: {
    resetValues() {
      // Resets all of the alert values
      this.email.alert = "";
      this.username.alert = "";
      this.password.alert = "";
      this.otherError = "";
    },
    captchaSubmit(token) {
      this.captchaToken = token;
      this.register();
    },
    formSubmit() {
      this.showCaptcha = true;
    },
    async register() {
      this.resetValues();
      const email = this.email.value.trim();
      const username = this.username.value.trim();
      const password = this.password.value.trim();

      const { ok, error, result } = await AuthenticationService.register({
        email,
        username,
        password,
        token: this.captchaToken
      });
      if (ok) {
        this.visible = false;
        this.$store.dispatch("token", result.data.token);
        setTimeout(_ => {
          window.location.href = "/app";
        }, 1000);
      } else {
        this.showCaptcha = false;
        this.deactive = false;
        this.captchaToken = null;
        this.$refs.recaptcha.resetRecaptcha();
        if (error.response === undefined) {
          this.otherError = "Can't connect to server.";
          return;
        }
        const errors = error.response.data.errors;
        for (let index in errors) {
          const message = errors[index].msg;
          const param = errors[index].param;
          if (this[param] === undefined) {
            this.otherError = message;
          } else {
            this[param].alert = message;
          }
        }
      }
    },
    loginButton() {
      this.$router.push("/login");
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
  background: #173d42;
}
.app-content {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  z-index: 9999;
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
  z-index: 9999;
  padding-bottom: 20px;
  background-image: url("../assets/leftPanelBackground.jpg");
  background-position: center;
  background-size: cover;
}
.box .title {
  text-align: center;
  font-size: 25px;
  margin-top: 10px;
  margin-bottom: 5px;
  color: white;
  user-select: none;
  display: flex;
  align-items: center;
  height: 60px;
}
.box .title .material-icons {
  margin-right: 5px;
  font-size: 40px;
}
.info {
  text-align: center;
  margin-bottom: 10px;
}
form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.input {
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: 80%;
  align-self: center;
  background: #074d57;
  padding: 10px;
}
.input-text {
  margin-bottom: 5px;
  margin-left: 3px;
}
input {
  outline: none;
  padding: 10px;
  border: none;
  background: none;
  background: #03262b;
  color: white;
}
.buttons {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
}
.button {
  padding: 10px;
  background: rgba(25, 151, 255, 0.699);
  margin: 10px;
  margin-top: 10px;
  user-select: none;
  border: none;
  color: white;
  font-size: 17px;
  outline: none;
  transition: 0.2s;
  cursor: pointer;
}
.button:hover {
  background: rgb(25, 151, 255);
}
.button:focus {
  background: rgb(25, 151, 255);
}

.button.deactive {
  background: rgba(70, 70, 70, 0.699);
}

.button.deactive :hover {
  background: rgba(70, 70, 70, 0.699);
}
.button.deactive :focus {
  background: rgba(70, 70, 70, 0.699);
}

.register-button {
  background: rgba(46, 204, 112, 0.67);
}
.register-button.button:hover {
  background: #2ecc71;
}
.register-button.button:focus {
  background: #2ecc71;
}

.captcha-input {
  width: initial;
}
.captcha {
  opacity: 0.7;
  transition: 0.3s;
}
.captcha:hover {
  opacity: 1;
}
.error {
  color: red;
}
</style>
