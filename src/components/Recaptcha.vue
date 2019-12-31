<template>
  <vue-recaptcha
    ref="recaptcha"
    :sitekey="sitekey"
    theme="dark"
    @verify="submit"
  />
</template>

<script>
import VueRecaptcha from "vue-recaptcha";
import config from "@/config.js";
export default {
  components: { VueRecaptcha },
  data() {
    return {
      sitekey: config.recaptcha
    };
  },
  beforeMount() {
    const existing = document.getElementById("reCaptchaScript");
    if (existing) existing.remove();

    const $script = document.createElement("script");
    $script.async = true;
    $script.id = "reCaptchaScript";
    $script.src =
      "https://www.google.com/recaptcha/api.js?onload=vueRecaptchaApiLoaded&render=explicit";
    document.head.appendChild($script);
  },
  methods: {
    submit(response) {
      this.$emit("verify", response);
    },
    resetRecaptcha() {
      this.$refs.recaptcha.reset(); // Direct call reset method
    }
  }
};
</script>
