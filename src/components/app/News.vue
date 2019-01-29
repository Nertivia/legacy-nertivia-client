<template>
  <div class="news">
    <div class="change-log">
      <span class="news-title">Changes in this release</span>

        <div class="change">
          <div class="date">{{changelog.date}}</div>
          <div class="changes-title">{{changelog.title}}</div>
          <div class="information">

            <div v-if="changelog.new">
              <strong>What's new?</strong><br>
              <ul>
                <li v-for="(wnew, index) in changelog.new" :key="index">{{wnew}}</li>
              </ul>
            </div> 
            <div v-if="changelog.fix">
              <strong>Issues fixed</strong><br>
              <ul>
                <li v-for="(wfix, index) in changelog.fix" :key="index">{{wfix}}</li>
              </ul>
            </div>
            <div v-if="changelog.next">
              <strong>Up next</strong><br>
              <ul>
                <li v-for="(wnext, index) in changelog.next" :key="index">{{wnext}}</li>
              </ul>
            </div>
            <div v-if="changelog.msg">
              {{changelog.msg}}
            </div>

          </div>
        </div>      
    </div>

    <div class="todo-list">
      <span class="news-title">Planned Features</span>
      <p>Features that are coming soon:</p>
      <ul class="plan-list">
        <li>Online, Offline status (Done)</li>
        <li>Profile picture</li>
        <li>Typing indicator</li>
        <li>Sending files</li>
        <li>Custom emojis</li>
        <li>Guilds</li>
      </ul>
    </div>

  </div>
</template>

<script>
import Spinner from '@/components/Spinner.vue'
import ChangeLog from '@/components/ChangeLog.vue'
import changelog from '@/changelog.js'
export default {
  components: {
    Spinner,
    ChangeLog
  },
  data() {
    return {
      changelog: changelog[0]
    }
  }
}
</script>


<style scoped>

.news {
  display: flex;
  flex: 1;
  margin:20px;
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
.todo-list{
  flex: 1;
  margin-left: 10px;
  background: rgba(0, 0, 0, 0.137);
  padding: 20px;
}
.change-log{
  background: rgba(0, 0, 0, 0.137);
  padding: 20px;
  flex: 1;
}
.plan-list{
  color: white;
}
.date{
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
  .todo-list{
    margin-left: 0;
  }
  .change-log {
    margin-bottom: 20px;
  }
}

</style>
