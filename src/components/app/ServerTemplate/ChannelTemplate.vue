<template>
  <div class="channel">
    <i class="material-icons">storage</i>
    <div class="channel-name">{{ChannelData.name}}</div>
  </div>
</template>

<script>
export default {
  props: ["ChannelData"]
};
</script>


<style scoped>
.channel {
  display: flex;
  align-items: center;
  margin: 5px;
	margin-top: 3px;
	margin-bottom: 3px;
  padding: 5px;
  border-radius: 5px;
  transition: 0.3s;
	font-size: 14px;
}
.channel:hover {
  background: rgba(139, 139, 139, 0.288);
}
.channel-name {
  overflow: hidden;
  text-overflow: ellipsis;
  margin-left: 5px;
}
</style>
