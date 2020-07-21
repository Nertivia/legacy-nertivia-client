<template>
  <div class="file-content music">
    <div class="info">{{ file.fileName }}</div>
    <audio controls>
      <source :src="file.url" type="audio/mp3" />
    </audio>
  </div>
</template>

<script>
export default {
  props: ["file"]
};
</script>

<style scoped lang="scss">
@import "@/styles/global.scss";
.file-content {
  display: flex;

  background: $embed-bg-color;
  border-radius: 5px;
  padding: 10px;
  margin-top: 5px;
  &.music {
    .info {
      margin-bottom: 5px;
    }
    flex-direction: column;
  }
}

.file-content .material-icons {
  font-size: 40px;
}
.file-content .download-button {
  font-size: 14px;
  background: rgba(0, 0, 0, 0.158);
  padding: 3px;
  text-align: center;
  display: inline-block;
  margin-top: 3px;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
  color: white;
}
.file-content .download-button:hover {
  background: rgba(0, 0, 0, 0.329);
}
.file-content .info {
  word-wrap: break-word;
  word-break: break-word;
  white-space: pre-wrap;
  font-size: 14px;
  overflow: hidden;
  max-width: 100%;
  color: white;
  overflow-wrap: anywhere;
  margin-top: 3px;
}
@media (max-width: 830px) {
  audio {
    width: initial;
  }
}
</style>
