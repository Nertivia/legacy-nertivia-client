<template>
  <button
    type="submit"
    :disabled="$props.loading"
  >
    <div
      v-if="$props.loading"
      class="loading-icon"
    />
    <div class="text">
      {{ $props.message }}
    </div>
  </button>
</template>

<script>
export default {
  props: [
    "loading",
    "message"
  ]
}
</script>


<style scoped>
button {
  display: flex;
  border: none;
  outline: none;
  background: rgba(0, 0, 0, 0.212);
  padding: 10px;
  color: white;
  justify-content: center;
  align-items: center;
  margin: auto;
  margin-bottom: 10px;
  transition: background-color 0.3s;
  height: 40px;
}
button:hover {
  background-color: rgba(0, 0, 0, 0.541);
}
button:focus {
  background-color: rgba(0, 0, 0, 0.541);
}
.loading-icon {
  height: 20px;
  width: 20px;
  background-size: 100%;
  background-image: url(../assets/spinner.svg);
  margin-right: 5px;
}
</style>

