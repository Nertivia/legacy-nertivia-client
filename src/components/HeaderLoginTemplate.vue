<template>
  <transition name="fade-in" appear >
    <div class="header">
      <div :class="{animation: true, night: !isDay }" id="animation">
        <div :class="{map: true, 'night-map': !isDay }"></div>
      </div>
      <div class="title">Nertivia</div>
    </div>
  </transition>
</template>

<script>
export default {
  data() {
    return {
      isDay: true
    };
  },
  mounted() {
    setInterval(_ => {
      if (this.isDay) {
        this.$emit("isDay", false);
        this.isDay = false;
      } else {
        this.$emit("isDay", true);
        this.isDay = true;
      }
    }, 10000);
  }
};
</script>

<style scoped>

.fade-in-enter-active {
  opacity: 0;
  animation: bounce-in .5s;
  animation-delay: 0.5s;
}


@keyframes bounce-in {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  50%{
    transform: translateY(10px);  
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}


/* .fade-in-enter-active, .fade-in-leave-active {
  transition: .5s;
  transition-delay: 0.5s
}
.fade-in-enter, .fade-in-leave-to  {
  opacity: 0;
  transform: translateY(-50px)
} */

.header {
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  margin-bottom: 0;
  margin-top: 50px;
  z-index: 99999;
}
.animation {
  height: 200px;
  width: 200px;
  background-color: #2cb4ff;
  border-radius: 50%;
  box-shadow: 0px 0px 96px -4px rgba(69, 212, 255, 1);
  overflow: hidden;
  transition: 10s;
  margin: auto;
  margin-bottom: 0;
}
.map {
  height: 200px;
  width: 200px;
  background-position: -490px center;
  background-size: 170%;
  background-repeat: no-repeat;
  background-image: url(./../assets/LogoAnimation/map.png);
  animation: rotateGlobe;
  animation-timing-function: linear;
  animation-duration: 10s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  transition: 10s;
}
.night-map {
  filter: grayscale(90%);
}

.night {
  background: rgb(0, 48, 73);
  box-shadow: 0px 0px 96px -4px rgb(0, 48, 73);
}
@keyframes rotateGlobe {
  from {
    background-position: -400px center;
  }
  to {
    background-position: 190px center;
  }
}
.header .title {
  color: white;
  font-size: 40px;
  margin-top: 10px;
}
</style>

