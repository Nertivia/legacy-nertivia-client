<template>
  <div class="left-panel">
    <MyMiniInformation />

    <div class="list">
      <online-friends />
    </div>

  </div>
</template>

<script>

import MyMiniInformation from '../../components/app/MyMiniInformation.vue'
import OnlineFriends from './relationships/OnlineFriends.vue'


export default {
  components: {
    MyMiniInformation,
    OnlineFriends,

  },
  data() {
    return {
    }
  }
}
</script>
<style scoped>

.left-panel {
  height: 100%;
  background-color: rgba(0, 0, 0, 0.671);
  width: 300px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  z-index: 1;
}
.list{
  margin: 10px;
  flex: 1;
  overflow: auto;
}




/* ------- SCROLL BAR -------*/
/* width */
.list::-webkit-scrollbar {
    width: 3px;
}

/* Track */
.list::-webkit-scrollbar-track {
    background: #8080806b;
}

/* Handle */
.list::-webkit-scrollbar-thumb {
    background: #f5f5f559;
}

/* Handle on hover */
.list::-webkit-scrollbar-thumb:hover {
    background: #f5f5f59e;
}
</style>
