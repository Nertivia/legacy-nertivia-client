<template>
  <div class="connecting-screen">
    <div class="center-box">
      <div class="cat-face">
        <div class="eye" />
      </div>
      <div class="items" v-if="message !== 'terms_not_agreed'">
        <div class="message">
          {{ message }}
        </div>
        <div class="button" v-if="errMessage" @click="logoutButton">
          Logout
        </div>
      </div>
      <div class="items" v-else>
        Changes to the Terms and conditions and the Privacy Policy
        <AgreeingToLegalStuff
          msg="By clicking on 'I Agree', you are agreeing to the updated"
        />
        <div class="button primary" @click="agreeClicked">
          I Agree
        </div>
        <a
          class="button warn"
          href="mailto:nertivia@gmail.com?subject=Delete%20My%20Account"
          >Request To Delete Account</a
        >
      </div>
    </div>
  </div>
</template>

<script>
import AgreeingToLegalStuff from "@/components/global/AgreeingToLegalStuff";
import userService from "@/services/userService.js";
export default {
  components: { AgreeingToLegalStuff },
  methods: {
    logoutButton() {
      this.$store.dispatch("logout");
      location.href = "/";
    },
    async agreeClicked() {
      await userService.agreePolicies();
      location.reload();
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
      if (status === 0) return this.$t("cnnecting");
      if (status === 1) return this.$t("authenticating");
      if (status === 2) return this.$t("ready");
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
.items {
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
.primary {
  background: rgba(0, 162, 255, 0.5);
  &:hover {
    background: rgb(0, 162, 255);
  }
}
.warn {
  background: rgba(255, 72, 72, 0.5);
  text-decoration: none;
  color: white;
  &:hover {
    background: rgb(255, 72, 72);
  }
}
</style>
