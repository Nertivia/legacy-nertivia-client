<template>
  <div class="news">
    <navigation />
    <div class="changelog">
      <div class="change-log">
        <div v-for="(change, index) in changelog" :key="index" class="change">
          <div
            class="heading"
            :style="change.headColor ? `background-color: ${change.headColor}` : ``"
          >
            <div class="date">{{ change.date }}</div>
            <div class="changes-title">{{ change.title }}</div>
          </div>
          <div class="information">
            <div v-if="change.new">
              <strong>What's new?</strong>
              <br />
              <ul>
                <li v-for="(wnew, index) in change.new" :key="index" v-html="wnew" />
              </ul>
            </div>
            <div v-if="change.fix">
              <strong>Issues fixed</strong>
              <br />
              <ul>
                <li v-for="(wfix, index) in change.fix" :key="index" v-html="wfix" />
              </ul>
            </div>
            <div v-if="change.next">
              <strong>Up next</strong>
              <br />
              <ul>
                <li v-for="(wnext, index) in change.next" :key="index" v-html="wnext" />
              </ul>
            </div>
            <div v-if="change.msg" v-html="change.msg" />
          </div>
        </div>
        <div class="see-all-button" v-if="!showAll" @click="showAll = true">View older changes</div>
      </div>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import Navigation from "@/components/app/Navigation";
import changelog from "@/utils/changelog.js";
export default {
  components: { Navigation },
  data() {
    return {
      showAll: false,
    };
  },
  computed: {
    changelog() {
      if (this.showAll) {
        return changelog;
      }
      return [changelog[0]];
    }
  }
};
</script>


<style scoped>
.news {
  display: flex;
  width: 100%;
  height: 100%;
  color: white;
  overflow: auto;
  position: relative;
}

.news-title {
  display: inline-block;
  margin-bottom: 10px;
  margin-left: 10px;
  margin-top: 20px;
  font-size: 21px;
  color: white;
  font-weight: bold;
  padding-bottom: 10px;
}
.todo-list {
  flex: 1;
  margin-left: 10px;
  background: rgba(0, 0, 0, 0.137);
  padding: 20px;
}
.change {
  margin-bottom: 10px;
  padding-bottom: 10px;
}
.heading {
  padding: 10px;
  background: #042f3a;
  margin-bottom: 10px;
}
.information {
  overflow-wrap: break-word;
  margin: 10px;
}
.heading.latest {
  background: rgba(38, 139, 255, 0.87);
}
.change-log {
  background: #054151;
  overflow-y: auto;
  max-width: 700px;
  width: 100%;
  margin: auto;
}
.changelog {
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  overflow: auto;
}
.plan-list {
  color: white;
}
.date {
  text-align: right;
  font-size: 19px;
  margin-right: 10px;
  color: rgba(255, 255, 255, 0.692);
}
.changes-title {
  font-size: 30px;
  color: rgba(255, 255, 255, 0.979);
  text-align: center;
  font-weight: bold;
  margin-top: -5px;
  margin-bottom: 10px;
}
.see-all-button {
  background: #172a2c;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  align-content: center;
  height: 40px;
  user-select: none;
  cursor: pointer;
  transition: 0.2s;
  
}
.see-all-button:hover {
  background: #0b1415;
}
</style>
