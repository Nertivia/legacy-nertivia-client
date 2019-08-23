<template>
  <div class="search-header">
    <div class="search-area">
      <input type="text" :placeholder="`Search for ${name}`">
    </div>
    <div class="filter-area"></div>
  </div>
</template>

<script>
export default {
  props: [
    'name'
  ]
}
</script>

<style lang="scss" scoped>
.search-header {
  display: flex;
  background: rgba(0, 0, 0, 0.231);
  width: 100%;
  height: 70px;
  flex-shrink: 0;
}
.search-area {
  height: 100%;
  width: 300px;
  display: flex;
  flex-direction: column;
  align-items: center;
  align-content: center;
  flex-direction: column;
  justify-content: center;
}
input {
  border-radius: 5px;
}
</style>