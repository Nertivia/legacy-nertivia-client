<template>
  <div class="news">
    <navigation />
    <div class="changelog">
      <div class="change-log">
        <div v-for="(change, index) in changelog" :key="index" class="change">
          <div class="heading" :class="{ 'latest-color': index === 0 }">
            <div class="date">{{ $t("updated-on") }} {{ change.date }}</div>
            <div class="changes-title">{{ change.title }}</div>
          </div>
          <news-template :change="change" />
          <!-- <div class="information">
            <div v-if="change.new">
              <strong>{{ $t("whats-new") }}</strong>
              <br />
              <ul>
                <li
                  v-for="(wnew, index) in change.new"
                  :key="index"
                  v-html="wnew"
                />
              </ul>
            </div>
            <div v-if="change.fix">
              <strong>{{ $t("issues-fixed") }}</strong>
              <br />
              <ul>
                <li
                  v-for="(wfix, index) in change.fix"
                  :key="index"
                  v-html="wfix"
                />
              </ul>
            </div>
            <div v-if="change.next">
              <strong>{{ $t("up-next") }}</strong>
              <br />
              <ul>
                <li
                  v-for="(wnext, index) in change.next"
                  :key="index"
                  v-html="wnext"
                />
              </ul>
            </div>
            <div v-if="change.msg" v-html="change.msg" />
          </div> -->
        </div>
        <div class="see-all-button" v-if="!showAll" @click="showAll = true">
          {{ $t("view-older-changes") }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/app/Navigation";
import NewsTemplate from "@/components/global/NewsTemplate";
import changelog from "@/utils/changelog.js";
export default {
  components: { Navigation, NewsTemplate },
  data() {
    return {
      showAll: false
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

<style scoped lang="scss">
@import "@/styles/global";
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
  background: #ffffff1c;
  margin-bottom: 10px;
}
.latest-color {
  background: $primary-button-color;
}
.information {
  overflow-wrap: break-word;
  margin: 10px;
}
.heading.latest {
  background: rgba(38, 139, 255, 0.87);
}
.change-log {
  background: #2c3746;
  box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.3);
  overflow-y: auto;
  max-width: 700px;
  width: 100%;
  margin: auto;
  border-radius: 4px;
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
  text-align: center;
  font-size: 17px;
  color: rgba(255, 255, 255, 0.808);
  margin-top: 10px;
  margin-bottom: 5px;
}
.changes-title {
  font-size: 25px;
  color: rgba(255, 255, 255, 0.979);
  text-align: center;
  font-weight: bold;
  margin-top: 0px;
  margin-bottom: 10px;
}
.see-all-button {
  background: rgba(255, 255, 255, 0.1);
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
  background: rgba(255, 255, 255, 0.2);
}
</style>
