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
              Reset Password
            </div>
            <div class="info">How could you forget your password?</div>
            <form
              v-if="!success"
              action="#"
              @submit.prevent="submitForm"
              @keydown="keyDownEvent"
            >
              <div class="input">
                <div class="input-text">
                  New password
                  <span v-if="password.alert" class="error"
                    >- {{ password.alert }}</span
                  >
                </div>
                <input
                  v-model="password.value"
                  type="password"
                  autocomplete="new-password"
                />
              </div>

              <div class="buttons">
                <button
                  type="submit"
                  :class="{ button: true, deactive: deactive }"
                >
                  Change Password
                </button>
              </div>
            </form>
            <div v-else>
              <div style="margin-top: 10px; margin-bottom: 10px;opacity: 0.8">
                Your password has successfully been changed!
              </div>
              <div class="buttons">
                <div class="button" @click="loginButton">
                  Login
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
import AuthenticationService from "@/services/AuthenticationService";

const ElectronFrameButtons = () =>
  import("@/components/ElectronJS/FrameButtons.vue");

export default {
  components: { HeaderLogin, ElectronFrameButtons },
  data() {
    return {
      isElectron: window && window.process && window.process.type,
      visible: true,
      password: { value: "", alert: "" },
      deactive: false,
      success: false
    };
  },
  methods: {
    resetValues() {
      this.password.alert = "";
    },
    loginButton() {
      window.location.href = "/login";
    },
    async submitForm() {
      this.resetValues();
      const password = this.password.value.trim();
      if (!password) {
        this.password.alert = "Password is required";
        return;
      }
      const code = this.$route.query.code;
      const id = this.$route.query["unique-id"];
      if (!code) {
        this.password.alert = "Code not found.";
        return;
      }
      if (!id) {
        this.password.alert = "id not found.";
        return;
      }

      const { ok, error } = await AuthenticationService.resetPasswordCode(
        code,
        this.password.value,
        id
      );

      if (ok) {
        this.success = true;
      } else {
        this.deactive = false;
        if (error.response === undefined) {
          this.password.alert = "Can't connect to server.";
          return;
        }
        const errors = error.response.data.errors;
        for (let index in errors) {
          const message = errors[index].msg;
          this.password.alert = message;
        }
      }
    },
    keyDownEvent(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.submitForm();
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
  height: 100%;
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
  cursor: pointer;
  border-radius: 4px;
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

.error {
  color: red;
}
</style>
