<template>
  <transition name="fade-in" appear>
    <div class="header">
      <div class="cat">
        <div class="eyes" />
      </div>
      <div class="title">
        Nertivia
      </div>
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
    setInterval(() => {
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
  animation: bounce-in 0.5s;
  animation-delay: 0.5s;
}

@keyframes bounce-in {
  0% {
    transform: translateY(-20px);
    opacity: 0;
  }
  50% {
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
  flex-shrink: 0;
}
.cat {
  height: 200px;
  width: 200px;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url(./../../assets/transparentLogo.svg);
  overflow: hidden;
  position: relative;
  margin: auto;
  margin-bottom: 0;
}
.eyes {
  position: absolute;
  left: 120px;
  top: 101px;
  height: 0px;
  width: 25px;
  background: white;
  animation: blink 5s;
  animation-iteration-count: infinite;
}
@keyframes blink {
  24%,
  100% {
    height: 0;
  }
  3% {
    height: 33px;
  }
}

.night {
  background: rgb(0, 48, 73);
  box-shadow: 0px 0px 96px -4px rgb(0, 48, 73);
}

.header .title {
  color: white;
  font-size: 30px;
}
</style>
