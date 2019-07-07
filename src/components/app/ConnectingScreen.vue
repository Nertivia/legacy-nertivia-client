<template>
  <div class="connecting-screen">
    <div class="center-box">
      <div class="cat-face">
        <div class="eyes"></div>
        <div class="animation"></div>
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

.cat-face{
  height: 300px;
  width: 300px;
  background-position: center;
  background-size: 100%;
  background-repeat: no-repeat;
  background-image: url(./../../assets/logo.png);
  display: flex;
  position: relative;
}
.animation {
  height: 280px;
  width: 280px;
  border: 16px solid #3498db;
  border-top: 16px solid white; 
  border-radius: 50%;
  animation: spin 2s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.eyes {
  position: absolute;
  left: 180px;
  top: 166px;
  height: 0px;
  width: 25px;
  background: white;
  animation: blink 5s cubic-bezier(0.17, 0.41, 0.76, 0.98);
  animation-iteration-count: infinite;
}
@keyframes blink {
  20%, 100% {
    height: 0px;
  }
  0% {
    height: 0 px;
  }
  10% {
    height: 35px;
  }
}


.message{
  text-align: center;
  margin-top: 20px;
  font-size: 20px;
  user-select: none;
}
</style>
