<template>
  <div class="my-mini-information">
    <div class="profile-picture" :style="`background-image: url(${avatar})`"></div>
    <div class="information">
      <div class="name">{{user.username}}</div>
      <div class="tag">@{{user.tag}}</div>

      <div class="status" v-on:click="status.isPoppedOut = !status.isPoppedOut"> 
        <img class="current-status" :src="getStatus"/>
        <i class="material-icons expand-status-icon">expand_more</i>
        <transition name="show-status-list">
          <statusList v-if="status.isPoppedOut" v-click-outside="closeMenus" class="status-popout" />
        </transition>
      </div>
    </div>
    <div class="setting-icon" @click="openSettings">
      <i class="material-icons">settings</i>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main';
import config from '@/config.js'
import statusList from '../../components/app/statusList.vue'
import settingsService from '@/services/settingsService'

export default {
  components: {
    statusList
  },
  data() {
    return {
      status: {
        isPoppedOut: false,
      }
    }
  },
  methods: {

    closeMenus() {
      this.status.isPoppedOut = false;
    },
    async changeStatus (status){
      // emit to server to change their status.
      console.log(status)
      const {ok, error, result} = await settingsService.setStatus(status);
      if (ok && result.data.status == true) {
        this.$store.dispatch('changeStatus', result.data.set)
      }
    },
    openSettings() {
      this.$store.dispatch('setPopoutVisibility', {name: 'settings', visibility: true})
    }
  },
   created() {
    //When user changes their own status (statusList.vue)
    bus.$on('status-change', this.changeStatus)

  },
  beforeDestroy(){
    bus.$off('status-change', this.changeStatus)
  },
  computed: {
    user() {
      return this.$store.getters.user
    },
    avatar() {
      return config.domain + "/avatars/" +this.$store.getters.user.avatar
    },
    getStatus() {
      return require(`./../../assets/status/${this.$store.getters.user.status || 0}.svg`) 
    }
  }
}
</script>



<style scoped>


.show-status-list-enter-active, .show-status-list-leave-active {
  transition: .1s;
}
.show-status-list-enter, .show-status-list-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

.my-mini-information {
  border-bottom: solid 1px rgb(218, 218, 218);
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
}

.profile-picture{
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.377);
  margin-left: 10px;
  margin-right: 10px;
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
}

.information{
  color: white;
  margin-top: -7px;
  flex: 1;
}

.setting-icon{
  color: white;
  margin: auto;
  margin-right: 15px;
  padding: 5px;
  border-radius: 50%;
  cursor: default;
  user-select: none;
  transition: 0.3s;

}
.setting-icon:hover {
  background: rgba(0, 0, 0, 0.294);
}
.setting-icon .material-icons{
  display: block;
  margin: auto;
}
.status {
  display: inline-block;
  padding-top: 1px;
  padding-left: 5px;
  margin-left: 10px;
  transition: 0.3s;
  user-select: none;
  border-radius: 10px;

}

.status:hover {
  background: rgba(26, 25, 25, 0.349);
}

.expand-status-icon{
  opacity: 0;
  transition: 0.3s;
}

.status:hover .expand-status-icon{
  opacity: 1;
}

.status .current-status {
  width: 20px;
  height: 20px;
  background-size: 100%;
  background-position: center;
}

.name {
  margin-top: 10px;
}

.tag {
  color: rgb(199, 199, 199);
  font-size: 13px;
  display: inline-block;
  vertical-align: top;
  margin-top: 5px;
}



</style>
