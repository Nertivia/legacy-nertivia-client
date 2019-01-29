<template>
  <div class="form">
    <form action="#" @submit.prevent="register">
      <div class="input">
        <div class="alert">{{otherError}}</div>
        <div class="input-title">Email: <div class="alert">{{email.alert}}</div></div>
        <input type="email" autocomplete="on" v-model="email.value">
      </div>
      <div class="input">
        <div class="input-title">Username: <div class="alert">{{username.alert}}</div></div>
        <input type="username" autocomplete="off" v-model="username.value">
      </div>
      <div class="input">
        <div class="input-title">Password: <div class="alert">{{password.alert}}</div></div>
        <input type="password" autocomplete="new-password" v-model="password.value">
      </div>
      <div class="input">
        <div class="input-title">Password confirm: <div class="alert">{{passwordConfirm.alert}}</div></div>
        <input type="password" autocomplete="new-password" v-model="passwordConfirm.value">
      </div>
      <div class="cap">
        <recaptcha ref="recaptcha" @verify="captchaSubmit" />
      </div>
      <loading-button :loading="currentMessage == 1" :message="buttonMessages[currentMessage]" />
    </form>
  </div>
</template>

<script>
import Recaptcha from '../Recaptcha.vue'
import AuthenticationService from '@/services/AuthenticationService.js'
import {bus} from '../../main';
import LoadingButton from "../../components/Button.vue"
export default {
  components: {
    LoadingButton,
    Recaptcha
  },
  data() {
    return {
      email: {value: "", alert: ""},
      username: {value: "", alert: ""},
      password: {value: "", alert: ""},
      passwordConfirm: {value: "", alert: ""},
      otherError: "",
      buttonMessages: [
        "Register",
        "Creating... ( Thank you c: )"
      ],
      currentMessage: 0,
      captcha: null
    }
  },
  methods: {
    resetValues() {
      // Resets all of the alert values
      this.email.alert = "";
      this.username.alert = "";
      this.password.alert = "";
      this.passwordConfirm.alert = "";
      this.otherError = ""
    },
    async register() {
      this.currentMessage = 1
      this.resetValues();
      const email = this.email.value.trim();
      const username = this.username.value.trim();
      const password = this.password.value.trim();
      const passwordConfirm = this.passwordConfirm.value.trim();

      // check if password + password confirm matches.
      if ( password != passwordConfirm ) {
        this.currentMessage = 0;
        return this.passwordConfirm.alert = "Passwords do not match!"
      }
      const {ok, error, result} = await AuthenticationService.register({email, username, password, token: this.captcha})
      this.currentMessage = 0
      if ( ok ) {
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