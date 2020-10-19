<template>
  <div class="bg" @mousedown="backgroundClick">
    <div class="box">
      <div class="error" v-if="error">{{ error }}</div>
      <Disclaimer
        v-if="showNotice"
        @close="$emit('close')"
        @understood="showNotice = false"
      />
      <div class="content" v-if="!showNotice">
        <div class="material-icons heart">favorite</div>
        <div class="text">Thanks for trying out Nertivia!</div>
        <div class="sub-text text">
          Notice: You must be over 14 to use Nertivia.
        </div>
        <form
          v-if="!showCaptcha"
          class="form"
          action="#"
          @submit.prevent="showCaptcha = true"
          @keydown="keyDown"
        >
          <custom-input
            :error="errors.username"
            v-model="username"
            theme="light"
            class="input"
            name="Username"
          />
          <custom-input
            :error="errors.email"
            v-model="email"
            theme="light"
            class="input"
            name="Email"
            type="email"
          />
          <custom-input
            :error="errors.password"
            v-model="password"
            theme="light"
            class="input"
            name="Password"
            type="password"
          />
          <div class="links">
            <a href="/login" class="link">Login to your account</a>
            <!-- <div class="link disabled" style="cursor: not-allowed;" title="This feature is coming soon.">Reset password</div> -->
          </div>
          <AgreeingToLegalStuff />
          <button class="button" @click="showCaptcha = true">
            <span class="material-icons">check</span>
          </button>
        </form>
        <!-- HCaptcha -->
        <div class="sub-text text" v-if="showCaptcha && !showEmailConfirm">
          To prevent bots, we have this extra step:
        </div>
        <div class="captcha" v-if="showCaptcha && !showEmailConfirm">
          <Recaptcha ref="recaptcha" @verify="register" />
        </div>
        <!-- Confirm Email -->
        <div class="sub-text text" v-if="showEmailConfirm">
          Check your email for a code
        </div>
        <custom-input
          v-if="showEmailConfirm"
          :error="errors.confirm"
          v-model="confirm"
          theme="light"
          class="input"
          name="Confirm Code"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Disclaimer from "@/components/homePage/Disclaimer.vue";
import CustomInput from "@/components/global/CustomInput";
import Recaptcha from "@/components/global/Recaptcha.vue";
import AgreeingToLegalStuff from "@/components/global/AgreeingToLegalStuff.vue";
import AuthenticationService from "@/services/AuthenticationService";
export default {
  components: { CustomInput, Recaptcha, AgreeingToLegalStuff, Disclaimer },
  data() {
    return {
      email: "",
      username: "",
      password: "",
      confirm: "",
      showNotice: true,
      recaptcha: null,
      showCaptcha: false,
      showEmailConfirm: false,
      error: null,
      errors: {
        email: "",
        username: "",
        password: "",
        confirm: ""
      }
    };
  },
  watch: {
    async confirm(val) {
      const v = val.trim();
      if (v.length !== 10) return;
      const { ok, result, error } = await AuthenticationService.confirmEmail(
        this.email,
        v
      );
      if (!ok) {
        if (error.response === undefined) {
          this.error = "Can't connect to server.";
          return;
        }
        this.errors.confirm =
          error.response.data.error || "Something went wrong.";
        return;
      }
      this.visible = false;
      this.$store.dispatch("token", result.data.token);
      setTimeout(() => {
        window.location.href = "/app";
      }, 500);
    }
  },
  methods: {
    backgroundClick(e) {
      if (this.showCaptcha || this.showEmailConfirm) return;
      if (e.target.classList.contains("bg")) {
        this.$emit("close");
      }
    },
    keyDown(event) {
      if (event.keyCode === 13) {
        event.preventDefault();
        this.showCaptcha = true;
      }
    },
    resetErrors() {
      this.error = null;
      this.errors.email = "";
      this.errors.username = "";
      this.errors.password = "";
      this.errors.confirm = "";
    },
    async register(captchaToken) {
      this.resetErrors();
      const { ok, error } = await AuthenticationService.register({
        email: this.email,
        username: this.username,
        password: this.password,
        token: captchaToken
      });
      if (!ok) {
        this.$refs.recaptcha.resetRecaptcha();
        this.showCaptcha = false;
        if (error.response === undefined) {
          this.error = "Can't connect to server.";
          return;
        }
        const errors = error.response.data.errors;
        for (let i = 0; i < errors.length; i++) {
          const err = errors[i];
          if (typeof this.errors[err.param] === "string") {
            this.errors[err.param] = err.msg;
            continue;
          }
          this.error = err.msg;
        }
        return;
      }
      this.showEmailConfirm = true;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/styles/global";
.bg {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1111111;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-content: center;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}
.box {
  display: flex;
  flex-direction: column;
  background: $other-box-color;
  align-self: center;
  padding: 5px;
  color: white;
  max-width: 350px;
  border-radius: 5px;
  overflow: auto;

  box-shadow: 0px 0px 6px 1px black;
}
.content {
  display: flex;
  flex-direction: column;
}
.input {
  align-self: center;
  margin-top: 10px;
  max-width: 250px;
  width: 100%;
  margin-bottom: 10px;
}
.text {
  text-align: center;
}
.sub-text {
  opacity: 0.8;
}
.form {
  display: flex;
  align-self: center;
  align-items: center;
  align-content: center;
  flex-direction: column;
  max-width: 250px;
  width: 100%;
}
.heart {
  align-self: center;
  margin-bottom: 10px;
  font-size: 60px;
  color: red;
  text-shadow: 0px 0px 8px #00000070;
}
.button {
  border-radius: 50%;
  width: 40px;
  height: 40px;
  outline: none;
  display: flex;
  color: white;
  justify-content: center;
  align-items: center;
  justify-items: center;
  border: none;
  cursor: pointer;
  opacity: 0.8;
  box-shadow: 0px 0px 10px 2px black;
  background: $primary-button-color;
  margin-bottom: 5px;
  margin-top: 10px;
  transition: 0.2s;
  &:hover {
    opacity: 1;
  }
  &:focus {
    opacity: 1;
  }
}
.link {
  color: white;
  cursor: pointer;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
  &.disabled {
    opacity: 0.4;
    &:hover {
      text-decoration: initial;
    }
  }
}
.links {
  font-size: 14px;
  margin-bottom: 10px;
  align-self: flex-start;
}
@media (max-width: 406px) {
  .box {
    max-width: initial;
    border-radius: initial;
  }
}

.captcha {
  align-self: center;
  margin-top: 10px;
}
.error {
  background: rgb(255, 71, 71);
  border-radius: 4px;
  align-self: center;
  padding: 5px;
}
</style>
