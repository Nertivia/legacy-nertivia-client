<template>
  <div class="errors">
    <div class="errors-title">Fix these mistakes:</div>
    <li class="error" v-for="(error, index) in errors" :key="index">{{error.msg}}</li>
  </div>
</template>


<script>
export default {
  props: ['errors']
}
</script>


<style scoped>

.errors{
  background: rgb(255, 62, 62);
  color: white;
  border-radius: 10px;
  padding: 10px;
}

</style>
