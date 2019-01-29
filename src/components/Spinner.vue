<template>
  <div class="loading-screen">
    <div class="loading-animation"></div>
    <div class="title">{{$props.msg}}</div>
  </div>
</template>

<script>
export default {
  props: [
    "msg"
  ]
}
</script>


<style scoped>
.loading-screen{
  margin: 50px;
}
.loading-animation{
  height: 100px;
  width: 100px;
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
