<template>
  <div class="form">
    <form action="#" @submit.prevent="login">
      <div class="input">
        <div class="alert other-alert">{{otherError}}</div>
        <div class="input-title">Email: <div class="alert">{{email.alert}}</div></div>
        <input type="email" autocomplete="on" v-model="email.value">
      </div>
      <div class="input">
        <div class="input-title">Password: <div class="alert">{{password.alert}}</div></div>
        <input type="password" autocomplete="current-password" v-model="password.value">
      </div>
      <div class="cap">
        <recaptcha ref="recaptcha" @verify="captchaSubmit" />
      </div>
      <loadingButton :loading="currentMessage == 1" :message="buttonMessages[currentMessage]" />
    </form>
  </div>
</template>

<script>
import Recaptcha from '../Recaptcha.vue'
import {bus} from '../../main';
import loadingButton from "../../components/Button.vue"
import AuthenticationService from '@/services/AuthenticationService';
export default {
  components: {
    loadingButton,
    Recaptcha
  },
  data() {
    return {
      email: {value: "", alert: ""},
      password: {value: "", alert: ""},
      otherError: "",
      buttonMessages: [
        "Login",
        "Logging in..."
      ],
      currentMessage: 0,
      captcha: null
    }
  },
  methods: {
    resetValues() {
      // Resets all of the alert values
      this.email.alert = "";
      this.password.alert = "";
      this.otherError = "";
    },
    async login() {
      this.currentMessage = 1
      this.resetValues();
      const email = this.email.value.trim();
      const password = this.password.value.trim();
      const captcha = this.captcha;

      const {ok, error, result} = await AuthenticationService.login({email, password, token: captcha})
      this.currentMessage = 0

      if (ok) {
        this.$store.dispatch('token', result.data.token)
        this.$store.dispatch('user', result.data.user)
      } else {
        this.captcha = null;
        this.$refs.recaptcha.resetRecaptcha();
        if (error.response === undefined) {
           this.otherError = "Can't connect to server."
           return;
         }
         const errors = error.response.data.errors;
         for (let index in errors) {
           const message = errors[index].msg;
           const param = errors[index].param;
           if(this[param] === undefined) {
             this.otherError = message;
           } else {
             this[param].alert = message;
           }
         }
      }
    },
    captchaSubmit(token) {
      this.captcha = token;
    }
  }
}
</script>

<style scoped>
.input {
  display: table;
    margin: auto;
}
.cap {
  margin: 20px;
  opacity: 0.8;
  transition: 0.3s;
}
.cap:hover {
  opacity: 1;
}
</style>
