<template>
  <div class="typing-status">
    <object class="animation" type="image/svg+xml" :data="animation"></object>
    <div class="text"><strong>{{this.$props.username}}</strong> is typing...</div>
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
  display: flex;
  transition: 0.3s;
  flex-shrink: 0;
  flex: 1;
}
.animation {
  height: 20px;
  width: 20px;
  display: flex;
}
.text {
  margin: auto;
  margin-left: 5px;
  font-size: 13px;
}

</style>
