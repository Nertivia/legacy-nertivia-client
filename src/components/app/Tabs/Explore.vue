<template>
  <div class="explore-tab">
    <div class="left-panel">
      <div class="header">
        <div class="icon">
          <i class="material-icons">explore</i>
        </div>
        <div class="details">
          <div class="title">Explore</div>
          <div class="description">Find new servers, Emojis and more!</div>
        </div>
      </div>
      <div class="items">
        <div
          class="item"
          v-for="(tab, index) in tabs"
          :key="index"
          :class="{selected: selectedTab === index}"
          @click="selectedTab = index"
        >
          <i class="material-icons">{{tab.icon}}</i>
          {{tab.name}}
        </div>
      </div>
    </div>
    <div class="right-panel">
      <div class="header"> <i class="material-icons">{{tabs[selectedTab].icon}}</i>{{tabs[selectedTab].name}}</div>
      <div class="coming-soon" v-if="selectedTab > 0">
        <div class="icon">
          <i class="material-icons">explore</i>
        </div>
        <div class="text">Coming soon!</div>
      </div>
      <component :is="tabs[selectedTab].component" /> 
    </div>
  </div>
</template>

<script>
import { bus } from "@/main";
import Servers from './Explore/servers'
export default {
  components: { Servers },
  data() {
    return {
      selectedTab: 0,
      tabs: [
        // {icon: "home", name: "home", component: ""},
        { icon: "rss_feed", name: "Servers", component: "servers" },
        { icon: "face", name: "Emojis", component: "" },
        { icon: "brush", name: "Themes", component: "" },
        { icon: "message", name: "Message Styles", component: "" }
      ]
    };
  },
  mounted() {},
  methods: {},
  computed: {}
};
</script>


<style lang="scss" scoped>
.explore-tab {
  display: flex;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.459);
  color: white;
}
.left-panel {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.274);
  width: 300px;
  flex-shrink: 0;
  .items {
    user-select: none;
    .item {
      .material-icons {
        margin-right: 5px;
      }
      display: flex;
      align-content: center;
      align-items: center;
      background: rgba(0, 0, 0, 0.199);
      margin: 5px;
      padding: 10px;
      border-radius: 5px;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        background: rgba(0, 0, 0, 0.452);
      }
      &.selected {
        background: rgba(0, 0, 0, 0.452);
      }
    }
  }
  .header {
    display: flex;
    height: 100px;
    background: rgba(0, 0, 0, 0.226);
    user-select: none;
    .icon {
      display: flex;
      flex-direction: column;
      align-items: center;
      align-content: center;
      justify-content: center;
      flex-shrink: 0;
      width: 100px;
      position: relative;
      .material-icons {
        font-size: 70px;
      }
      &::after{
        content: 'BETA';
        position: absolute;
        background: #ff3333;
        border-radius: 5px;
        font-size: 10px;
        padding: 2px;
        bottom: 15px;
        z-index: 999;
      }
    }
    .details {
      align-self: center;
      .title {
        font-size: 20px;
        margin-bottom: 5px;
        position: relative;
      }
      .description {
        opacity: 0.7;
        font-size: 14px;
      }
    }
  }
}
.coming-soon {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.39);
  color: white;
  .material-icons {
    font-size: 100px;
  }
}

.right-panel {
  .header {
    background: rgba(0, 0, 0, 0.448);
    padding: 10px;
    display: flex;
    align-items: center;
    align-content: center;
    .material-icons {margin-right: 5px;}
    user-select: none;
    cursor: default;
  }
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}
</style>
