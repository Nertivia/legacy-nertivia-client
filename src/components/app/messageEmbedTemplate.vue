<template>
  <div class="embed" :class="{article: embed.type === 'article' || embed.type === 'video.other'}">
    <div class="right">
      <div class="image"><img v-if="embed.image" :src="`//images.weserv.nl/?url=${embed.image}`" alt=""></div>
    </div>
    <div class="left">
      <div class="title" v-if="embed.url"><a target=”_blank” :href="embed.url">{{embed.title}}</a></div>
      <div class="title" v-else>{{embed.title}}</div>
      <div class="description">{{embed.description}}</div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["embed"]
}
</script>

<style scoped>
.embed{
  background: rgba(0, 0, 0, 0.507);
  border-radius: 10px;
  padding: 5px;
  display: flex;
  max-width: 500px;
  min-width: 200px;
  align-self: flex-start;
  margin-top: 5px;
}
.embed.article {
  flex-direction: column;
}
.article .left {
  order: 1;
}
.article .right {
  order: 2;
}
.article .image img {
  width: 100%;
  height: auto;
  margin-top: 5px;
}

.right {
  display: flex;
}

.title {
  font-size: 15px;
}
.description {
  font-size: 14px;
  white-space: pre-wrap;
}
.image img {
  width: auto;
  height: 100px;
  border-radius: 5px;
  align-self: center;
}
.image {
  display: flex;
  margin-right: 10px;
  align-self: center;
}
a {
  color: rgb(86, 159, 253);
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>

