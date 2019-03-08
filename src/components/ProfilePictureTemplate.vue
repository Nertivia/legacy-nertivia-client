<template>
  <div
    class="profile-picture"
    :style="`height: ${$props.height}; width: ${$props.width}; background-image: url(${$props.url})`"
  ></div>
</template>

<script>
export default {
    props: ['url', 'height', 'width']
}
</script>


<style scoped>
.profile-picture {
  background-color: rgba(0, 0, 0, 0.281);
  margin: auto;
  border-radius: 50%;
  margin-right: 5px;
  margin-left: 0;
  flex-shrink: 0;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}
</style>
