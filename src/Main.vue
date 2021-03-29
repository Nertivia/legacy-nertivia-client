<template>
  <div class="main-content">
    <div class="message" @click="messageClick" v-if="showNotice">
      <div class="material-icons icon">info</div>
      <div class="text">
        This version of Nertivia is retiring soon. Click here for more info.
      </div>
      <div class="material-icons close-icon" title="Hide">close</div>
    </div>
    <div class="retire-popup" v-if="showPopup">
      <div class="dialog">
        <div class="header">Legacy</div>
        <div class="details">
          This version of Nertivia is soon to be retired moved to
          <a style="color: #00b6ff;" href="https://legacy.nertivia.net"
            >https://legacy.nertivia.net</a
          >.<br />Try out
          <a style="color: #00b6ff;" href="https://beta.nertivia.net"
            >https://beta.nertivia.net</a
          >
          for a better experience and less ram usage.
        </div>
        <div class="button" @click="hideNotice">Okay</div>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      showNotice: !localStorage["hideBetaNotice"],
      showPopup: false
    };
  },
  methods: {
    hideNotice() {
      localStorage["hideBetaNotice"] = true;
      this.showNotice = false;
      this.showPopup = false;
    },
    messageClick(event) {
      const closeClicked = event.target.closest(".close-icon");
      if (closeClicked) {
        this.hideNotice();
        return;
      }
      this.showPopup = true;
    }
  }
};
</script>
<style scoped lang="scss">
.message {
  display: flex;
  align-items: center;
  align-content: center;
  flex-shrink: 0;
  position: absolute;
  left: 0;
  padding: 5px;
  right: 0;
  top: 0;
  background: #368dff;
  z-index: 99999;
  color: white;
  justify-content: center;
  font-family: Arial, Helvetica, sans-serif;
  cursor: pointer;
}
.message .text {
  margin-left: 5px;
  color: rgba(255, 255, 255, 0.9);
}
.close-icon {
  opacity: 0.7;
  margin-left: auto;
}
.close-icon:hover {
  opacity: 1;
}
.retire-popup {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1111;
  display: flex;
  align-items: center;
  justify-content: center;
}
.dialog {
  display: flex;
  flex-direction: column;
  max-height: 200px;
  max-width: 300px;
  height: 100%;
  width: 100%;
  background: #1a1a1d;
  color: white;
  font-family: Arial, Helvetica, sans-serif;
  border-radius: 4px;
  overflow: hidden;
  .header {
    background: #368dff;
    padding: 10px;
  }
  .details {
    align-self: center;
    padding: 10px;
    color: rgba(255, 255, 255, 0.7);
  }
  .button {
    background: #368dff;
    padding: 10px;
    border-radius: 4px;
    align-self: center;
    margin-top: auto;
    margin-bottom: 10px;
    cursor: pointer;
  }
}
</style>
<style>
html {
  height: 100%;
}

body {
  margin: 0;
  height: 100%;
  overflow: hidden;
}

#app {
  font-family: "Montserrat", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #383838;
  height: 100%;
}

/* ------- SCROLL BAR -------*/
/* width */
::-webkit-scrollbar {
  width: 10px;
}

/* Track */
::-webkit-scrollbar-track {
  background: #8080806b;
}

/* Handle */
::-webkit-scrollbar-thumb {
  background: #f5f5f559;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  background: #f5f5f59e;
}
</style>
