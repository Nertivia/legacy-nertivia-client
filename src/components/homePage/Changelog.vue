<template>
  <div class="changelog">
    <div class="title">Recent Changes:</div>
    <div class="changelog-list">
      <div
        v-for="(log, i) in logs"
        :key="i"
        class="change"
        :class="{ primary: !i }"
      >
        <div class="line title">{{ log.title }}</div>
        <div class="line details" v-html="getLogDetails[i]" />
        <div class="line secondary-detail">
          v{{ log.version }}
          <span class="dot" />
          {{ log.date }}
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
  },
  computed: {
    getLogDetails() {
      const log = this.logs.map(c => {
        let str = "";
        if (c.new && c.new.length) {
          for (let i = 0; i < c.new.length; i++) {
            const newStr = c.new[i];
            str += " " + newStr;
          }
        }
        if (c.fix && c.fix.length) {
          for (let i = 0; i < c.fix.length; i++) {
            const fixStr = c.fix[i];
            str += " " + fixStr;
          }
        }
        if (c.msg) {
          str += " " + c.msg;
        }
        return str;
      });
      return log;
    }
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
.line.details {
  display: block;
  font-size: 14px;
  opacity: 0.8;
  margin-top: -5px;
  margin-left: 5px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 5px;
  height: 20px;
}
</style>
