<template>
  <h-captcha :sitekey="sitekey" theme="dark" ref="recaptcha" @verify="submit" />
</template>

<script>
import hCaptcha from "@hcaptcha/vue-hcaptcha";

import config from "@/config.js";
export default {
  components: { hCaptcha },
  data() {
    return {
      sitekey: config.captchaSiteKey
    };
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
