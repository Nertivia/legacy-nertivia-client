<template>
  <div class="news">
    <div class="change-log">
      <span class="news-title">Changes in this release</span>

      <div class="change" v-for="(change, index) in changelog" :key="change.title">
        <div :class="`heading ${index === 0 ? 'latest': ''}`">
          <div class="date">{{change.date}}</div>
          <div class="changes-title">{{change.title}}</div>
        </div>
        <div class="information">
          <div v-if="change.new">
            <strong>What's new?</strong>
            <br>
            <ul>
              <li v-for="(wnew, index) in change.new" :key="index">{{wnew}}</li>
            </ul>
          </div>
          <div v-if="change.fix">
            <strong>Issues fixed</strong>
            <br>
            <ul>
              <li v-for="(wfix, index) in change.fix" :key="index">{{wfix}}</li>
            </ul>
          </div>
          <div v-if="change.next">
            <strong>Up next</strong>
            <br>
            <ul>
              <li v-for="(wnext, index) in change.next" :key="index">{{wnext}}</li>
            </ul>
          </div>
          <div v-if="change.msg">{{change.msg}}</div>
        </div>
      </div>
    </div>

    <div class="todo-list">
      <span class="news-title">Planned Features</span>
      <p>Features that are coming soon:</p>
      <ul class="plan-list">
        <li>Online, Offline status(Done)</li>
        <li>Profile picture (done)</li>
        <li>Typing indicator (done)</li>
        <li>Sending files (done)</li>
        <li>Custom emojis</li>
        <li>Guilds</li>
      </ul>
    </div>
  </div>
</template>

<script>
import Spinner from "@/components/Spinner.vue";
import changelog from "@/utils/changelog.js";
export default {
  components: {},
  data() {
    return {
      changelog: changelog
    };
  }
};
</script>


<style scoped>
.news {
  display: flex;
  flex: 1;
  margin: 20px;
  color: white;
  overflow: auto;
}
.news-title {
  display: inline-block;
  margin-bottom: 10px;
  font-size: 20px;
  color: white;
  font-weight: bold;
  padding-bottom: 10px;
  border-bottom: solid 1px white;
}
.todo-list {
  flex: 1;
  margin-left: 10px;
  background: rgba(0, 0, 0, 0.137);
  padding: 20px;
}
.change {
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: solid 1px white;
}
.heading{
  padding: 10px;
  background: rgba(0, 0, 0, 0.555);
  margin-bottom: 10px;
}
.heading.latest {
  background: rgba(38, 139, 255, 0.87);
}
.change-log {
  background: rgba(0, 0, 0, 0.137);
  padding: 20px;
  flex: 1;
  overflow-y: auto;
}
.plan-list {
  color: white;
}
.date {
  text-align: left;
  margin-right: 50px;
  color: rgba(255, 255, 255, 0.692);
}
.changes-title {
  font-size: 20px;
  color: rgba(255, 255, 255, 0.979);
  margin-bottom: 10px;
  margin-top: 10px;
  font-weight: bold;
}

@media (max-width: 840px) {
  .news {
    flex-direction: column;
  }
  .todo-list {
    margin-left: 0;
  }
  .change-log {
    margin-bottom: 20px;
  }
}
</style>
