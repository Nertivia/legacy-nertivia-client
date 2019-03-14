<template>
  <div class="emoji-suggetions-list">
    <div class="emoji" v-for="emoji in $props.emojiArray" :key="emoji.hexcode">
      <div class="preview">{{emoji.unicode}}</div>
      <div class="short-code">:{{emoji.shortcodes[0]}}:</div>
    </div>
  </div>
</template>


<script>



export default {
  props: ['emojiArray'],
  methods: {},
  computed: {}
};
</script>


<style scoped>
.emoji-suggetions-list{
  position: absolute;
  bottom: 0;
  left: 70px;
  max-height: 400px;
  overflow-y: auto;

  background: rgba(32, 32, 32, 0.87);
  color: white;
  padding: 5px;
  transition: 0.3s;
  border-radius: 5px;
  user-select: none;
  cursor: default;
}
.emoji-suggetions-list:hover{
  background: rgba(32, 32, 32, 0.966);
}
.preview{

  margin-right: 5px;
}
.name{
  flex: 1;
}
.short-code {
  margin-right: 10px;
}
.emoji{
  display: flex;
  padding: 5px;
}
.emoji.selected {

}
</style>
