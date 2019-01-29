<template>
  <div class="add-friend-panel">
    <div class="panel-title" @click="expanded = !expanded">
      <div>
        <i class="material-icons" v-if="!expanded">
          person_add
        </i>
        <span>{{expanded ? "Hide" : "Add friend"}}</span>
      </div>
    </div>
    <transition name="slide" appear>
      <div class="add-friend" v-if="expanded">
        <div class="title">Add friend</div>
        <div class="info">Type in your friends username and tag. eg: someone@jt4g</div>
        <div class="infoC">Creators tag: Fishie@azK0</div>
        <form action="#" @submit.prevent="addFriend">
          <input type="text" placeholder="username@tag" v-model="input">
          <loadingButton :loading="currentButtonMessage == 1" :message="buttonMessages[currentButtonMessage]" />
        </form>
        <div :class="{message: true, warning: errorMessage.isError}">
          {{errorMessage.message}}
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import RelationshipService from '@/services/RelationshipService.js'
import loadingButton from './../../Button.vue'
export default {
  components: {
    loadingButton
  },
  data() {
    return {
      expanded: false,
      buttonMessages: [
        "Add Friend",
        "Adding..."
      ],
      currentButtonMessage: 0,
      input: "",
      errorMessage:{
        message: "",
        isError: false
      }
    }
  },
  methods: {
    async addFriend() {
      this.$set(this.errorMessage, 'message', "")
      
      this.currentButtonMessage = 1;
      const split = this.input.trim().split("@");

      // validation
      if ( split.length <2 || split.length >2  || split[1] === "" || split[1].length !== 4){
        this.$set(this.errorMessage, 'message', "Invalid username or tag.")
        this.$set(this.errorMessage, 'isError', true)
        this.currentButtonMessage = 0;
        return;
      }

      const username = split[0];
      const tag = split[1];

      const {ok, error, result} = await RelationshipService.post({username, tag})
      this.currentButtonMessage = 0;
      if ( ok ) {
        this.$set(this.errorMessage, 'message', result.data.message)
        this.$set(this.errorMessage, 'isError', false)
      } else {
        if (error.response === undefined) {
          this.$set(this.errorMessage, 'message', "Can't connect to server.")
          this.$set(this.errorMessage, 'isError', true)
          return
        }
        this.$set(this.errorMessage, 'message', error.response.data.errors[0].msg)
        this.$set(this.errorMessage, 'isError', true)
      }
    }
  }
}
</script>


<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: .3s;
}
.slide-enter, .slide-leave-to /* .fade-leave-active below version 2.1.8 */ {
  margin-bottom: -270px;
  opacity: 0;
}

.add-friend-panel{
  width: 100%;
  background: rgba(0, 0, 0, 0.123);
  display: flex;
  flex-direction: column;
}

.add-friend{
  background: rgba(0, 0, 0, 0.13);
  flex: 1;
  height: 250px;
  display: flex;
  flex-direction: column;
  color: white;
  padding: 10px;
}
.title{
  margin: auto;
  margin-top: 10px;
  margin-bottom: 0px;
  font-size: 20px;
  color: white;
  user-select: none;
  cursor: default;
}
.info{
  text-align: center;
  color: rgb(182, 182, 182);
  font-size: 15px;
  user-select: none;
  cursor: default;
}
.infoC{
  text-align: center;
  color: rgb(255, 79, 79);
  font-size: 15px;
}
form {
  margin: auto;
  margin-top: 5px;
  margin-bottom: 0px;
}

.message{
  margin: auto;
  margin-top: 2px;
  font-size: 15px;
  color: green;
}
.warning {
  color: red;
}
.panel-title{
  background: rgba(0, 0, 0, 0.274);
  width: 100%;
  text-align: center;
  padding-top: 15px;
  padding-bottom: 15px;
  color: white;
  cursor: pointer;
  user-select: none;
  display: flex;
  transition: 0.3s;
}
.panel-title:hover{
  background: rgba(0, 0, 0, 0.445);
}

.panel-title .material-icons{
  vertical-align: top;
  margin-top: -2px;
}
.panel-title span{
  margin-left: 5px;
}
.panel-title div{
  margin: auto;
}
</style>
