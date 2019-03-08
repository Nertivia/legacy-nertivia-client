<template>
  <div class="settings-darken-background">
    <div class="settings-box">
      <div class="tabs">

        <div 
        :class="{tab: true, selected: currentTab == 'my-profile'}"
        @click="tabClicked('my-profile','account_circle', 'My Profile')">
          <div class="material-icons">account_circle</div>
          <div>My Profile</div>
        </div>
        
        <div
        :class="{tab: true, selected: currentTab == 'ddddd'}"
        @click="tabClicked('ddddd','palette', 'Coming soon!')">
          <div class="material-icons">palette</div>
          <div>Message Themes</div>
        </div>

        <div
        :class="{tab: true, selected: currentTab == 'eee'}"
        @click="tabClicked('eee','error', 'Spoopi')">
          <div class="material-icons">error</div>
          <div>Another Tab</div>
        </div>

      </div>
      <div class="panel">
        <div class="title">
          <div class="material-icons">{{icon}}</div>
          <div class="in-title">{{title}}</div>
          <div class="close-button" @click="close">
            <div class="material-icons">close</div>
          </div>
        </div>
        <component :is="currentTab"></component>
      </div>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main'
import MyProfile from './SettingsPanels/MyProfile.vue'
export default {
  components: {
    MyProfile
  },
  data() {
    return {
      currentTab: "my-profile",
      icon: "account_circle",
      title: "My Profile"
    }
  },
  methods: {
    tabClicked(currentTab, icon, title) {
      this.currentTab = currentTab;
      this.icon = icon;
      this.title = title;
    },
    close() {
      this.$store.dispatch('setPopoutVisibility', {name: 'settings', visibility: false})
    }
  }
}
</script>


<style scoped>
.settings-darken-background{
  position: absolute;
  background: rgba(0, 0, 0, 0.541);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 99;
  display: flex;
  color: white;
}
.settings-box{
  display: flex;
  margin: auto;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.507);
}
.tabs{
  background: rgba(24, 24, 24, 0.938);
  height: 600px;
  width: 200px;
}
.panel {
  background: rgba(31, 31, 31, 0.924);
  height: 600px;
  width: 600px;
}
.tab {
  display: flex;
  padding: 10px;
  background: rgba(26, 26, 26, 0.233);
  margin-top: 5px;
  margin-bottom: 5px;
  cursor: default;
  user-select: none;
  transition: 0.3s;
}
.tab.selected {
  background: rgb(61, 61, 61) !important;
}
.tab div {
  margin: 5px;
}
.tab:hover {
  background: rgba(61, 61, 61, 0.616);
}
.title{
  display: flex;
  padding: 10px;
  font-size: 25px;
  background: rgb(20, 20, 20);
  margin-bottom: 20px;
}
.title .material-icons{
  font-size: 40px;
}
.title div {
  margin: auto;
  margin-left: 5px;
  margin-right: 5px;
}
.in-title {
  flex:1;
}
.close-button{
  display: flex;
  border-radius: 50%;
  padding: 5px;
  cursor: default;
  user-select: none;
  transition: 0.3s;
}
.close-button:hover{
  background: rgba(37, 37, 37, 0.692);
}
.close-button .material-icons {
  margin: auto;
  font-size: 30px;
}

@media (max-width: 815px) {
  .settings-box{
    width:100%
  }
}  
</style>

