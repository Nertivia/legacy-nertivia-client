<template>
  <div class="connecting-screen">
    <div class="center-box">
      <div class="animation">
        <div class="map"></div>
        <div class="flash-message"></div>
      </div>
      <div class="message">Connecting...</div>
    </div>
  </div>
</template>

<style scoped>
.connecting-screen {
  display: flex;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.76);
  color: white;
}
.center-box{
  margin: auto;
}

.animation{
  height: 300px;
  width: 300px;
  background-color: #2CB4FF;
  border-radius: 50%;
  box-shadow: 0px 0px 96px -4px rgba(69,212,255,1);
  overflow: hidden;
}
.map {
  height: 300px;
  width: 300px;
  background-position: -490px center;
  background-size: 170%;
  background-repeat: no-repeat;
  background-image: url(./../../assets/LogoAnimation/map.png);
  animation: rotateGlobe;
  animation-timing-function: linear;
  animation-duration: 4s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  
}

@keyframes rotateGlobe {
  from {
    background-position: -490px center;
  }
  to {
  background-position: 300px center;
  }
}

.flash-message {
  height: 300px;
  width: 300px;
  margin-top: -300px;
  background-position: center;
  background-size: 50%;
  background-repeat: no-repeat;
  background-image: url(./../../assets/LogoAnimation/message.png);
  animation: flashMessage;
  animation-timing-function: linear;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  opacity: 0.5;
}

@keyframes flashMessage {
  0% {
    opacity: 0;
  }
  10% {
    background-size: 55%;
  }
  30% {
    background-size: 50%;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}

.message{
  text-align: center;
  margin-top: 20px;
  font-size: 20px;
  user-select: none;
}
</style>
