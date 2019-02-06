<template>
  <div class="typing-status">
    <object class="animation" type="image/svg+xml" :data="animation"></object>
    <div class="text">{{this.$props.username}} is typing...</div>
  </div>
</template>

<script>
export default {
  props: ['username'],
  data() {
    return {
      animation: require('@/assets/typing-indicator.svg')
    }
  }
}
</script>

<style scoped>
.typing-status {
  color: white;
  background: rgba(0, 0, 0, 0.246);
  padding: 5px;
  margin-bottom: 5px;
  display: flex;
  transition: 0.3s;
  flex-shrink: 0;
}
.animation {
  height: 40px;
  width: 40px;
  display: flex;
}
.text {
  margin: auto;
  margin-left: 10px;
}


@keyframes moveBall {
  from{
    height: 0px;
    width: 0px;
    opacity: 1;
  }
  to {
    height: 40px;
    width: 40px;
    opacity: 0;
  }
}
</style>
