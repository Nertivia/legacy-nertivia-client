<template>
  <div id="app">
    <div class="app-content">
      <header-login />
      <div class="content">

          <div
            v-if="visible"
            class="box"
          >
            <div class="title">
              <div>404</div>
            </div>
            <div class="info">
              Nothing exists here.
              <br>
              <a style="color: #00ceff;" href="https://nertivia.tk">Go home</a>
            </div>
            
          </div>
      </div>
    </div>
    <div class="background">
      <div :class="{background: true, 'night-background': true}">
      </div>
      <div class="background day-background" />
    </div>
  </div>
</template>

<script>
import HeaderLogin from "@/components/HeaderLoginTemplate.vue";
export default {
  components: { HeaderLogin },
  data() {
    return {
      visible: true,
    };
  },

};
</script>

<style>
html, body {
  height: 100%;
}
</style>

<style scoped>
.fade-up-enter-active {
  opacity: 0;
  animation: bounce-in 0.5s;
  animation-delay: 0.7s;
}
.fade-up-leave-active {
  animation: bounce-in 0.5s reverse;
}

@keyframes bounce-in {
  0% {
    transform: translateX(30px);
    opacity: 0;
  }
  50% {
    transform: translateX(-10px);
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

/* .fade-up-enter-active, .fade-up-leave-active {
  transition: .5s;
  transition-delay: 0.5s
}
.fade-up-enter, .fade-up-leave-to /* .fade-leave-active {
  opacity: 0;
  transform: translateX(20px)
} */

#app {
  display: flex;
  flex-direction: column;
  transition: background 10s;
  color: white;
}
.app-content {
  display: flex;
  position: relative;
  flex-direction: column;
  height: 100%;
  width: 100%;
  overflow: auto;
  z-index: 9999;
  padding-bottom: 100px;
}
.background {
  position: fixed;
  height: 100%;
  width: 100%;
  transition: background 10s;
}

.night-background {
  opacity: 0;
  transition: 10s;
  background: linear-gradient(to bottom, #000000 0%,#606060 100%) !important;
}
.day-background {
  opacity: 1;
  background: linear-gradient(to bottom, #165dc0 0%,#5482bf 100%);  
  z-index: -1
}

.night-background.chosen {
  opacity: 1 !important;
}

.night-background .particles {
  opacity: 1;
}

.content {
  display: flex;
  height: 100%;
  margin: 10px;
  flex-shrink: 0;
}
.box {
  width: 100%;
  max-width: 400px;
  background: rgba(44, 44, 44, 0.774);
  margin: auto;
  margin-top: 20px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 9999;
  padding-bottom: 20px;
}
.box .title {
  text-align: center;
  font-size: 25px;
  margin-top: 10px;
  margin-bottom: 5px;
  color: white;
  user-select: none;
  display: flex;
  align-items: center;
  height: 60px;
}
.box .title .material-icons {
  margin-right: 5px;
  font-size: 40px;
}
.info {
  text-align: center;
  margin-bottom: 10px;
}
form {
  display: flex;
  flex-direction: column;
  width: 100%;
}
.input {
  display: flex;
  flex-direction: column;
  margin: 10px;
  width: 80%;
  align-self: center;
  background: rgb(59, 59, 59);
  padding: 10px;
  border-radius: 10px;
}
.input-text {
  margin-bottom: 5px;
  margin-left: 3px;
}
input {
  outline: none;
  padding: 10px;
  border: solid 1px rgba(0, 0, 0, 0);
  background: none;
  border-radius: 5px;
  background: rgb(36, 36, 36);
  color: white;
}
.buttons {
  display: flex;
  align-items: center;
  align-content: center;
  justify-content: center;
  justify-items: center;
}
.button {
  padding: 10px;
  background: rgba(25, 151, 255, 0.699);
  border-radius: 5px;
  margin: 10px;
  margin-top: 10px;
  user-select: none;
  border: none;
  color: white;
  font-size: 17px;
  outline: none;
  transition: 0.2s;
  box-shadow: 3px 3px rgba(23, 112, 255, 0.479);
}
.button:hover {
  background: rgb(25, 151, 255);
}
.button:focus {
  background: rgb(25, 151, 255);
}
.button:active {
  background: rgb(25, 151, 255);
  transform: translate(3px, 3px);
  box-shadow: 0px 0px rgba(0, 97, 207, 0.479);
}

.button.deactive {
  background: rgba(70, 70, 70, 0.699);
  box-shadow: 3px 3px rgba(0, 0, 0, 0.479);
}

.button.deactive :hover {
  background: rgba(70, 70, 70, 0.699);
}
.button.deactive :focus {
  background: rgba(70, 70, 70, 0.699);
}
.button.deactive:active {
  background: rgba(70, 70, 70, 0.699);
  transform: translate(3px, 3px);
  box-shadow: 0px 0px rgba(0, 0, 0, 0.479);
}

.register-button {
  background: rgba(46, 204, 112, 0.67);
  box-shadow: 3px 3px #0f7e3d;
}
.register-button.button:hover {
  background: #2ecc71;
}
.register-button.button:focus {
  background: #2ecc71;
}
.register-button.button:active {
  background: #2ecc71;
  transform: translate(3px, 3px);
  box-shadow: 0px 0px #0f7e3d;
}

.captcha-input {
  width: initial;
}
.captcha {
  opacity: 0.7;
  transition: 0.3s;
}
.captcha:hover {
  opacity: 1;
}
.error {
  color: red;
}
</style>
