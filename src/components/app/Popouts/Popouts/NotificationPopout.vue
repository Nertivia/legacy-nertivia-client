<template>
  <div class="notification">{{detail.message}}</div>
</template>


<script>
export default {
  data() {
    return {
      interval: null
    };
  },
  methods: {
    intervalSet() {
    clearTimeout(this.interval)
      this.interval = setTimeout(() => {
        this.$store.dispatch("setAllPopout", {
          show: false,
          type: null,
          unclosableType: null,
          messageID: null,
          channelID: null
        });
      }, 5000);
    }
  },
  watch: {
    "detail.id"() {
        this.intervalSet();
    }
  },
  computed: {
    detail() {
      return this.$store.getters.popouts.allPopout;
    }
  },
  mounted() {
      this.intervalSet()
  }
};
</script>

<style lang="scss" scoped>
.notification {
  background: rgba(255, 255, 255, 0.5);
  border-radius: 4px;
  -webkit-filter: blur(0);
  backdrop-filter: blur(10px);
  padding: 5px;
  position: absolute;
  color: rgba(0, 0, 0, 0.8);
  left: 50%;
  top: 50%;

  z-index: 9999;
  box-shadow: 0px 0px 10px black;
  text-align: center;
  position: fixed;
  font-size: 14px;
  top: 50%;
  user-select: none;
  cursor: default;
  transform: translate(-50%, -50%);

}
</style>