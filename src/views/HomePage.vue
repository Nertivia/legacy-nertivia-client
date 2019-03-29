<template>
<div id="app">
  <vue-headful title="Nertivia" description="Nertivia Chat Client"/>
  <div class="background-image"></div>
  <div class="layout">
    <div class="small-view-nav-bar">
      <div class="small-logo"></div>
      <div class="small-title">Nertivia</div>
      <div class="show-menu-button" @click="showMobileMenu = !showMobileMenu">
          <i class="material-icons">
              menu
          </i>
      </div>
    </div>
    <div class="panels">
        <div class="left-panel">

          <div class="title">The best chat client that won’t sell your data.</div>
          <img src="../assets/graphics/HomeGraphics.png" class="graphic-app" />
          <div class="change-log-mini" @click="showChangeLog = true">
            <div class="change-title">Change log <span style="font-size: 15px; color: rgba(211, 211, 211, 0.774);">Click for details</span></div>
            <div class="change-list">
              <div class="change" v-for="change in changelogFiltered" :key="change.title">
                <div class="notable-changes">{{change.shortTitle}}</div>
                <div class="change-date">{{change.date}}</div>
              </div>
            </div>
          </div>
        </div>
        <RightPanel  :class="{'show-menu-content': showMobileMenu }" />
    </div>
  </div>
  <transition name="fade">
    <ChangeLog v-if="showChangeLog"/>
  </transition>
</div>
</template>

<script>
import {bus} from '../main';
import RightPanel from "./../components/homePage/RightPanel.vue"
import ChangeLog from "./../components/ChangeLog.vue"
import changelog from '@/utils/changelog.js'
export default {
  components: {
    RightPanel,
    ChangeLog
  },
  data() {
    return {
      loginSelected: true,
      showMobileMenu: false,
      showChangeLog: false,
      changelog
    }
  },
  mounted() {
    bus.$on('closeChangeLog', () => {
      this.showChangeLog = false;
    })
  },
  computed: {
    changelogFiltered() {
      return this.changelog.slice(0, 3)
    }
  }

}
</script>


<style scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #383838;
  height: 100%;
}
button {
  font-family: 'Roboto', sans-serif;
}
.spinner{
    margin: auto;
    padding: 30px;
}

.background-image {
  background: url(./../assets/background.jpg);
  position: absolute;
  z-index: -1;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-repeat: no-repeat;
  background-position: bottom;
  background-size: cover;

}

.layout{
    display: flex;
    height: 100%;
    width:100%;
    flex-direction: column;
}
.panels{
    display: flex;
    height: 100%;
    width: 100%;
}
.left-panel {
    flex: 1;
    background: rgba(0, 0, 0, 0.253);
    overflow: auto;
    display: flex;
    flex-direction: column;
}

.loader{
  display: flex;
  flex-direction: column;
  
}
.title-panel{
    width: 100%;
    height: 150px;
}

.graphics-panel{
    flex: 1;

}

.graphic-app{
    display: table;
    margin: auto;
    margin-top: 20px;
    margin-bottom: 20px;
    width: 900px;
    height: auto;
    user-select: none;
}
.title{
  color: white;
  font-size: 35px;
  text-align: center;
  margin-top: 120px;
}

.change-log-mini{
  background: rgba(0, 0, 0, 0.322);
  height: 150px;
  width: 640px;
  margin: auto;
  margin-top: 20px;
  color: white;
  margin-bottom: 50px;
  flex-shrink: 0;
}

.change-title {
  font-size: 18px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
  user-select: none;
}

.change-list{
  display: flex;
}

.change {
  background: rgba(0, 0, 0, 0.335);
  width: 200px;
  height: 90px;
  margin-left: 10px;
  border-radius: 5px;
  transition: 0.3s;
  position: relative
}
.change:hover {
  background: rgba(0, 0, 0, 0.466);
}
.notable-changes{
  margin: 10px;
  cursor: default;
  user-select: none;
}

.change-date{
  position: absolute; 
  bottom: 10px;
  right: 10px;
  color: rgba(255, 255, 255, 0.753);
  cursor: default;
  user-select: none;
}

.small-view-nav-bar{
  width: 100%;
  height: 50px;
  background: rgba(0, 0, 0, 0.411);
  display: none;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

}

.small-logo {
  height: 30px;
  width: 30px;
  background: url(./../assets/logo.png);
  background-size: 105%;
  background-position: center;
  border-radius: 50%;
  box-shadow: 0px 0px 96px -4px rgba(69,212,255,1);
  margin: auto;
  margin-left: 10px;
  flex-shrink: 0;
}

.small-title{
    color: white;
    font-size: 20px;
    flex: 1;
    margin-left: 10px;
}

.show-menu-button{
    color: rgba(255, 255, 255, 0.698);
    margin-right: 20px;
    margin-top: 7px;
    user-select: none;
    transition: 0.3s
}

.show-menu-button:hover {
    color: rgb(255, 255, 255);
}

.show-menu-content {
    display: flex !important;
    width: 400px !important;
    opacity: 1 !important;
    transform: scale(1) !important;
}

@media (max-width: 1051px) {
  .change:nth-child(3){
    display: none;
  }
  .change-log-mini{
    width: 430px;
  }
}
@media (max-width: 906px) {

  .change:nth-child(3){
    display: block;
  }
  .change-log-mini{
    width: 640px;
  }
}
@media (max-width: 649px) {
  .change-list{
    flex-direction: column;
  }
  .change-log-mini{
    height: initial;
    width: calc(100% - 20px);
    padding-bottom: 10px;
    margin: auto;
  }
  .change{
    margin-bottom: 5px;
    margin-left: 5px;
    margin-right: 0;
    width: calc(100% - 10px);
  }
}
@media (max-width: 1380px) {
  .graphic-app{
    width: calc(100% - 80px);
  }
  .title{
    font-size: 30px;
    margin-left: 20px;
    margin-right: 20px;

  }
}  
@media (max-width: 906px) {
  .right-panel-home {
    position: absolute;
    bottom: 0;
    right: 0;
    top: 50px;
    display: flex;
    margin-right: 0;
    margin-top: 0;
    height:calc(100% - 50px);
    background-color: rgb(34, 34, 34);
    width: 0;
    overflow-x: hidden;
    transition: 0.5s ease;
    transform: scale(0.97);
    opacity: 0;

  }
  .right-panel-inner{
    width: 400px;
  }
  .small-view-nav-bar{
    display: flex;
  }

}
@media (max-width: 401px) {
  .show-menu-content {
    width: 100% !important;
  }
  .right-panel-inner{
    width: 100%;
  }
}
</style>


<!-- Used for forms !-->
<style>
@media (max-width: 1380px) {
  .graphic-app{
    width: calc(100% - 80px);
  }
}  

@media (max-width: 906px) {



  .right-panel-home {
    position: absolute;
    bottom: 0;
    right: 0;
    top: 50px;
    display: flex;
    margin-right: 0;
    margin-top: 0;
    height:calc(100% - 50px);
    background-color: rgba(34, 34, 34, 0.877);
    width: 0;
    overflow-x: hidden;
    transition: 0.5s ease;
    transform: scale(0.97);
    opacity: 0;
  }

  .right-panel-inner{
    width: 400px;
  }
  .small-view-nav-bar{
    display: flex;
  }

}
@media (max-width: 401px) {
  .show-menu-content {
    width: 100% !important;
  }
  .right-panel-inner{
    width: 100%;
  }
}

.form {
  color: white;
  margin: auto;
  padding: 10px;
}

input{
  padding: 10px;
  background: rgba(0, 0, 0, 0.301);
  outline: none;
  border: none;
  color: white;
  margin-top: 5px;
  margin-bottom: 10px;
  width: 200px;
  transition: 0.3s;
}

input:hover{
  background: rgba(0, 0, 0, 0.452);
}

input:focus {
  background: rgba(0, 0, 0, 0.603);
}
.input-title{
  margin-top: 10px;
}
.form-button{
  padding: 10px;
  background: rgba(0, 0, 0, 0.226);
  display: table;
  transition: 0.5s;
  margin: auto;
  color: white;
  border: none;
  outline: none;
}

.form-button:hover{
  background: rgba(0, 0, 0, 0.534)
}
.alert{
  color: red;
  font-size: 15px;
  width: 220px;
}
</style>
