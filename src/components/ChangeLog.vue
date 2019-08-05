<template>
  <div class="change-log">
    <div class="inner">
      <div
        class="close-button"
        @click="close"
      >
        <i class="material-icons">
          close
        </i>
      </div>
      <div class="change-title">
        Change Log <div class="changelog-icon">
          <i class="material-icons ">update</i>
        </div>
      </div>
      <div class="change-list">
        <div
          v-for="(change, index) in changelog"
          :key="index"
          class="change"
        >
          <div class="date">
            {{ change.date }}
          </div>
          <div class="changes-title">
            {{ change.title }}
          </div>
          <div class="information">
            <div v-if="change.new">
              <strong>What's new?</strong><br>
              <ul>
                <li
                  v-for="(wnew, index) in change.new"
                  :key="index"
                >
                  {{ wnew }}
                </li>
              </ul>
            </div>
            <div v-if="change.fix">
              <strong>Issues fixed</strong><br>
              <ul>
                <li
                  v-for="(wfix, index) in change.fix"
                  :key="index"
                >
                  {{ wfix }}
                </li>
              </ul>
            </div>
            <div v-if="change.next">
              <strong>Up next</strong><br>
              <ul>
                <li
                  v-for="(wnext, index) in change.next"
                  :key="index"
                >
                  {{ wnext }}
                </li>
              </ul>
            </div>
            <div v-if="change.msg">
              {{ change.msg }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from './../main.js'
import changelog from '@/utils/changelog.js'
export default {
  data() {
    return {
      changelog
    }
  },
  methods: {
    close() {
      bus.$emit('closeChangeLog')
    }
  }
}
</script>


<style scoped>
.change-log{
  position: absolute;
  background: rgba(0, 0, 0, 0.342);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  color: white;
}
.inner{
  background-color: rgba(0, 0, 0, 0.664);
  margin: auto;
  width: 600px;
  height: 700px;
  display: flex;
  flex-direction: column;
}

.close-button{
  margin: auto;
  margin-top: 10px;
  margin-right: 10px;
  user-select: none;
  cursor: default;
  color: grey;
  transition: .3s;
}
.close-button:hover{
  color: white;
}

.close-button .material-icons {
  font-size: 30px;
}

.change-title{
  color: white;
  font-size: 30px;
  margin: auto;
  margin-top: 10px;
  user-select: none;
  display: flex;
  padding-bottom: 15px;
  flex-shrink: 0;
}
.changelog-icon{
  margin-top: 2px;
  margin-left: 10px
}
.changelog-icon .material-icons {
  font-size: 40px;
}
.change-list {
  height: 100%;
  width: 100%;
  overflow: auto;
  border-top: 1px solid white;
}
.change{
  margin: 5px;
  min-height: 100px;
  border-bottom: solid 1px white;
  padding-bottom: 15px;
}
.change:last-child{
  border-bottom: none;
}
.date{
  text-align: right;
  padding-top: 10px;
  padding-right: 10px;
  color: grey;
}
.changes-title {
  font-size: 25px;
  padding-left: 15px;
  color: rgba(255, 255, 255, 0.795);
}
.information {
  margin: 10px;
  padding-left: 20px;
}

@media (max-height: 700px) {
  .inner {
    height: 100%;
  }
}
</style>

