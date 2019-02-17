<template>
    <div class="status-popout">
        <div class="status-list" @click="changeStatus(1)"><span class="status-icon"><img class="icon" :src="getStatusLogo(1)" /></span><span class="text">Online</span></div>
        <div class="status-list" @click="changeStatus(2)"><span class="status-icon"><img class="icon" :src="getStatusLogo(2)" /></span><span class="text">Away</span></div>
        <div class="status-list" @click="changeStatus(3)"><span class="status-icon"><img class="icon" :src="getStatusLogo(3)" /></span><span class="text">Busy</span></div>
        <div class="status-list" @click="changeStatus(4)"><span class="status-icon"><img class="icon" :src="getStatusLogo(4)" /></span><span class="text">Looking to play</span></div>
        <div class="status-list" @click="changeStatus(0)"><span class="status-icon"><img class="icon" :src="getStatusLogo(0)" /></span><span class="text">Offline</span></div>
      
    
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
    background-color: rgba(44, 44, 44, 0.671);
    border-radius: 10px;
    padding: 5px;
    width: 180px;
    z-index: 1;
}
.status-list {
    padding: 5px;
    transition: 0.3s;
    border-radius: 5px;
    margin: 5px;
}

.status-list:hover {
    background: rgba(0, 0, 0, 0.349);
}

.status-icon{
    display: inline-block;
}

.icon{
    height: 30px;
    width: 30px;
    margin-top: 3px;
}
.text{
    display: inline-block;
    vertical-align: top;
    margin-top: 9px;
    margin-left: 10px;
    padding-right: 5px;
}
</style>

