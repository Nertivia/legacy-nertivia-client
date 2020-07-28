<template>
  <div class="changelog">
    <div class="title">Recent Changes:</div>
    <div class="changelog-list">
      <div v-for="(log, i) in logs" :key="i" class="change" :class="{primary: !i}">
        <div class="line title">{{log.title}}</div>
        <div class="line secondary-detail">
          v{{log.version}}
          <span class="dot" />
          {{log.date}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import changelog from "@/utils/changelog.js";
export default {
  data() {
    return {
      logs: changelog.splice(0, 3)
    };
  }
};
</script>

<style scoped lang="scss">
@import "@/styles/global";
.change {
  background: $box-secondary-color;
  box-shadow: 0 0 5px 0 black;
  border-radius: 4px;
  margin: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
  padding: 5px;
  display: flex;
  flex-direction: column;
}
.primary {
  background: $primary-button-color;
}
.line {
  display: flex;
  align-items: center;
}
.dot {
  display: inline-block;
  background: white;
  border-radius: 50%;
  width: 5px;
  height: 5px;
  margin-left: 5px;
  margin-right: 5px;
}
.secondary-detail {
  opacity: 0.8;
  font-size: 14px;
  align-self: flex-end;
}
.line.title {
  margin: 5px;
}
</style>