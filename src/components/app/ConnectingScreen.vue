<template>
  <div class="connecting-screen">
    <div class="center-box">
      <div class="cat-face">
        <div class="eye" />
      </div>
      <div class="message">
        {{ message }}
      </div>
      <div class="button" v-if="errMessage" @click="logoutButton">
        Logout
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    logoutButton() {
      this.$store.dispatch("logout");
      location.href = "/";
    }
  },
  computed: {
    errMessage() {
      return this.$store.getters.connectionErrorMessage;
    },
    status() {
      return this.$store.getters.connectionStatus;
    },
    message() {
      const status = this.status;
      if (this.errMessage) return this.errMessage;
      if (status === 0) return "Connecting...";
      if (status === 1) return "Authenticating...";
      if (status === 2) return "Ready!";
      return "";
    }
  }
};
</script>

<style scoped lang="scss">
.connecting-screen {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(5px);
  height: 100%;
  width: 100%;
  color: white;
  align-content: center;
  justify-content: center;
  align-items: center;
  z-index: 9999999;
}
.cat-face {
  position: relative;
  width: 200px;
  height: 200px;
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(./../../assets/transparentLogo.svg);
}
.eye {
  position: absolute;
  right: 60px;
  top: 100px;
  width: 20px;
  height: 1px;
  background-size: 100%;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII=);
  animation: wink 2s cubic-bezier(0.17, 0.41, 0.76, 0.98);
  animation-iteration-count: infinite;
}

@keyframes wink {
  20%,
  100% {
    height: 0px;
  }
  0% {
    height: 0 px;
  }
  10% {
    height: 35px;
  }
}
.center-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  justify-content: center;
}
.message {
  text-align: center;
}
.button {
  background: rgba(0, 0, 0, 0.3);
  align-self: center;
  padding: 10px;
  margin-top: 10px;
  cursor: pointer;
  border-radius: 4px;
  transition: 0.2s;
  &:hover {
    background: rgba(0, 0, 0, 0.5);
  }
}
</style>
