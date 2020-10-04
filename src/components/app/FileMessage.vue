<template>
  <div class="file-content">
    <div class="icon">
      <i class="material-icons">insert_drive_file</i>
    </div>
    <div class="information">
      <div class="info">{{ file.fileName }}</div>
      <a :href="file.url" download target="_blank">
        <div class="download-button">{{ $t("download") }}</div>
      </a>
    </div>
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
}

.file-content .material-icons {
  font-size: 40px;
}
.file-content .download-button {
  font-size: 14px;
  background: rgba(0, 0, 0, 0.2);
  padding: 3px;
  text-align: center;
  display: inline-block;
  margin-top: 3px;
  transition: 0.3s;
  user-select: none;
  cursor: pointer;
  color: white;
  border-radius: 5px;
  padding: 5px;
}
.file-content .download-button:hover {
  background: rgba(0, 0, 0, 0.3);
}
.file-content .info {
  font-size: 14px;
  overflow: hidden;
  max-width: 100%;
  color: white;
  overflow-wrap: anywhere;
  margin-top: 3px;
}
</style>
