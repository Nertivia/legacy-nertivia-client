<template>
  <div class="status-popout">
    <div
      class="status-list"
      @click="changeStatus(1)"
    >
      <span class="status-icon"><img
        class="icon"
        :src="getStatusLogo(1)"
      ></span><span class="text">Online</span>
    </div>
    <div
      class="status-list"
      @click="changeStatus(2)"
    >
      <span class="status-icon"><img
        class="icon"
        :src="getStatusLogo(2)"
      ></span><span class="text">Away</span>
    </div>
    <div
      class="status-list"
      @click="changeStatus(3)"
    >
      <span class="status-icon"><img
        class="icon"
        :src="getStatusLogo(3)"
      ></span><span class="text">Busy</span>
    </div>
    <div
      class="status-list"
      @click="changeStatus(4)"
    >
      <span class="status-icon"><img
        class="icon"
        :src="getStatusLogo(4)"
      ></span><span class="text">Looking to play</span>
    </div>
    <div
      class="status-list"
      @click="changeStatus(0)"
    >
      <span class="status-icon"><img
        class="icon"
        :src="getStatusLogo(0)"
      ></span><span class="text">Offline</span>
    </div>
  </div>
</template>

<script>
import {bus} from '../../main';
export default {
    methods: {
        getStatusLogo(status){
            return  require(`./../../assets/status/${status}.svg`)
        },
        changeStatus(status) {
            bus.$emit('status-change', status)
        }   
    }
}
</script>


<style scoped>

.status-popout{
  position: absolute;
  bottom: 55px;
  left: 30px;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  width: 180px;
  z-index: 4;
}
.status-list {
  padding: 10px;
  transition: 0.3s;
  display: flex;
  align-items: center;
  align-content: center;
  flex-shrink: 0;

}

.status-list:hover {
  background: rgba(46, 46, 46, 0.651);
}

.status-icon{
  display: inline-block;
  flex-shrink: 0;
}

.icon{
  height: 20px;
  width: 20px;
  margin-top: 3px;
  flex-shrink: 0;
}
.text{
  display: inline-block;
  vertical-align: top;
  flex-shrink: 0;
  margin-left: 10px;
  padding-right: 5px;
}
</style>

