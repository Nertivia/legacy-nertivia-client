<template>
  <div id="app">
    <div class="app-content">
      <header-login />
      <div class="content">
        <div v-if="visible" class="box">
          <div class="title">
            <div>404</div>
          </div>
          <div class="info">
            Nothing exists here.
            <br />
            <a style="color: #00ceff;" href="https://nertivia.tk">Go home</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderLogin from "@/components/global/HeaderLoginTemplate.vue";
export default {
  components: { HeaderLogin },
  data() {
    return {
      visible: true
    };
  }
};
</script>

<style>
html,
body {
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

#app {
  display: flex;
  flex-direction: column;
  color: white;
  background: linear-gradient(to bottom, #005799 0, #0076d1);
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

.content {
  display: flex;
  height: 100%;
  margin: 10px;
  flex-shrink: 0;
}
.box {
  width: 100%;
  max-width: 400px;
  margin: auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 9999;
  padding-bottom: 20px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 4px;
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

.info {
  text-align: center;
  margin-bottom: 10px;
}
</style>
