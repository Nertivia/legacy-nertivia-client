<template>
  <div id="app">
    <electron-frame-buttons v-if="isElectron" />
    <div class="app-content">
      <header-login />
      <div class="content">
        <transition appear name="fade-up">
          <div v-if="visible" class="box">
            <Disclaimer
              v-if="showNotice"
              :hideClose="true"
              @understood="showNotice = false"
            />
            <div class="inner-content" v-if="!showNotice">
              <div class="title">
                <i class="material-icons">account_circle</i>
                Register
              </div>
              <div class="info">
                Welcome, I Hope you enjoy Nertivia!<br />
                Notice: You must be over 14 to use Nertivia.
              </div>
              <form
                v-if="currentPage === 0"
                action="#"
                @submit.prevent="formSubmit"
                @keydown="keyDownEvent"
              >
                <div class="input">
                  <div class="input-text">
                    Email
                    <span v-if="email.alert" class="error"
                      >- {{ email.alert }}</span
                    >
                  </div>
                  <input
                    v-model="email.value"
                    type="email"
                    placeholder="Email"
                    autocomplete="off"
                  />
                </div>

                <div class="input">
                  <div class="input-text">
                    Username
                    <span v-if="username.alert" class="error"
                      >- {{ username.alert }}</span
                    >
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
                    <span v-if="password.alert" class="error"
                      >- {{ password.alert }}</span
                    >
                  </div>
                  <input
                    v-model="password.value"
                    type="password"
                    autocomplete="off"
                    placeholder="Password"
                  />
                </div>
                <span
                  v-if="otherError"
                  class="error"
                  style="text-align: center;"
                  >{{ otherError }}</span
                >
                <AgreeingToLegalStuff
                  style="max-width: 320px; align-self: center;"
                />
                <div class="buttons">
                  <button
                    type="submit"
                    :class="{ button: true, deactive: deactive }"
                  >
                    Register
                  </button>
                  <button
                    class="button register-button"
                    @click.prevent="loginButton"
                  >
                    I'm already a user!
                  </button>
                </div>
              </form>
              <div v-if="currentPage === 1" class="captcha-box">
                <div class="input captcha-input">
                  <div class="input-text">Beep Boop</div>
                  <div class="captcha">
                    <Recaptcha ref="recaptcha" @verify="captchaSubmit" />
                  </div>
                </div>
              </div>
              <div v-if="currentPage === 2" class="form">
                <div class="input">
                  <div class="input-text">
                    Check your email:
                    <span v-if="confirm_code.alert" class="error"
                      >- {{ confirm_code.alert }}</span
                    >
                  </div>
                  <input
                    @input="confirmCodeInput"
                    v-model="confirm_code.value"
                    type="text"
                    placeholder="Code"
                    autocomplete="off"
                  />
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
import Disclaimer from "@/components/homePage/Disclaimer.vue";
import Recaptcha from "@/components/global/Recaptcha.vue";
import HeaderLogin from "@/components/global/HeaderLoginTemplate.vue";
import AuthenticationService from "@/services/AuthenticationService";
import AgreeingToLegalStuff from "@/components/global/AgreeingToLegalStuff.vue";

const ElectronFrameButtons = () =>
  import("@/components/ElectronJS/FrameButtons.vue");

export default {
  components: {
    HeaderLogin,
    Recaptcha,
    ElectronFrameButtons,
    AgreeingToLegalStuff,
    Disclaimer
  },
  data() {
    return {
      isElectron: window && window.process && window.process.type,
      showNotice: true,
      currentPage: 0,
      visible: true,
      confirm_code: { value: "", alert: "" },
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
      this.currentPage = 1;
    },
    keyDownEvent(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.formSubmit();
      }
    },
    async register() {
      this.resetValues();
      const email = this.email.value.trim();
      const username = this.username.value.trim();
      const password = this.password.value.trim();

      const { ok, error } = await AuthenticationService.register({
        email,
        username,
        password,
        token: this.captchaToken
      });
      if (ok) {
        this.currentPage = 2;
      } else {
        this.currentPage = 0;
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
    },
    async confirmCodeInput(event) {
      const value = event.target.value;
      if (value.length === 10) {
        const { ok, result, error } = await AuthenticationService.confirmEmail(
          this.email.value,
          value
        );
        if (!ok) {
          if (error.response === undefined) {
            this.otherError = "Can't connect to server.";
            return;
          }
          this.confirm_code.alert =
            error.response.data.error || "Something went wrong.";
        } else {
          this.visible = false;
          this.$store.dispatch("token", result.data.token);
          setTimeout(() => {
            window.location.href = "/app";
          }, 1000);
        }
      }
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
  background: $bg-color;
}
.app-content {
  display: flex;
  position: relative;
  flex-direction: column;
  width: 100%;
  overflow: auto;
  z-index: 9999;
  height: 100%;
}

.content {
  display: flex;
  height: 100%;
  margin: 10px;
  flex-shrink: 0;
}
.inner-content {
  display: flex;
  flex-direction: column;
  align-items: center;
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
  box-shadow: 0px 0px 5px 0px #000000bd;
  background: $box-secondary-color;
  border-radius: 4px;
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
form,
.form {
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.input-text {
  margin: 5px;
}
input {
  outline: none;
  padding: 10px;
  border: none;
  background: none;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
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
  border-radius: 4px;
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
