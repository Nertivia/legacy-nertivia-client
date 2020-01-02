<template>
  <div class="drop-background file-drag-popout">
    <div class="box">
      <i class="material-icons">insert_drive_file</i>
      <div class="info">
        Drop file
      </div>
    </div>
  </div>
</template>

<style scoped>
.drop-background {
  position: absolute;
  background: rgba(0, 0, 0, 0.521);
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  display: flex;
}
.box {
  margin: auto;
  height: 230px;
  width: 300px;
  color: white;
  display: flex;
  flex-direction: column;
  user-select: none;
  overflow: hidden;
  box-shadow: 0px 0px 20px 5px #151515bd;
  background-color: #044050;
  border-radius: 4px;
}
.material-icons {
  font-size: 80px;
  color: white;
  margin: auto;
  margin-top: 50px;
  margin-bottom: 10px;
}
.info {
  margin: auto;
  text-align: center;
  margin-top: 20px;
}
</style>
