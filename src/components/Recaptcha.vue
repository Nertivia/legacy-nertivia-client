<template>
  <vue-recaptcha ref="recaptcha" :sitekey="sitekey" theme="dark" @verify="submit"></vue-recaptcha>
</template>
 
<script>
import VueRecaptcha from 'vue-recaptcha';
import config from '@/config.js'
export default {
  components: { VueRecaptcha },
  data () {
    return {
      sitekey: config.recaptcha,

    }
  },
  methods: {
    submit(response) {
      this.$emit('verify', response)
    },
    resetRecaptcha () {
      this.$refs.recaptcha.reset() // Direct call reset method
    }
  }
}
</script>