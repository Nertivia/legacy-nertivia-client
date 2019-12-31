<template>
  <div class="loading-screen">
    <div
      class="loading-animation"
      :style="`height: ${size}px ; width: ${size}px ;`"
    />
    <div v-if="msg" class="title">
      {{ $props.msg }}
    </div>
  </div>
</template>

<script>
export default {
  props: {
    msg: String,
    size: {
      default: 100
    }
  }
};
</script>

<style scoped>
.loading-screen {
  margin: auto;
}
.loading-animation {
  background-size: 100%;
  background-image: url(../assets/spinner.svg);
  display: table;
  margin: auto;
}
.title {
  display: table;
  margin: auto;
  color: white;
  font-size: 20px;
  text-align: center;
}
</style>
